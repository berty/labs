package ipfsman

import (
	context "context"
	crand "crypto/rand"
	"encoding/base64"
	"fmt"
	"path"
	"strings"
	"sync"

	mobileipfs "github.com/ipfs-shipyard/gomobile-ipfs/go/bind/core"
	"github.com/pkg/errors"
	"go.uber.org/multierr"
	"go.uber.org/zap"
)

type Server struct {
	logger      *zap.Logger
	nodesByRepo map[string]*nodeWrapper
	nodesByID   map[string]*nodeWrapper
	mu          *sync.Mutex

	UnimplementedIPFSManagerServiceServer
}

var _ IPFSManagerServiceServer = (*Server)(nil)

func NewServer(logger *zap.Logger) (*Server, error) {
	return &Server{
		nodesByRepo: make(map[string]*nodeWrapper),
		nodesByID:   make(map[string]*nodeWrapper),
		mu:          new(sync.Mutex),
		logger:      SafeLogger(logger),
	}, nil
}

func (s *Server) StartNode(ctx context.Context, req *StartNodeRequest) (*StartNodeResponse, error) {
	// check args
	repoPath := req.GetRepoPath()
	if repoPath == "" {
		return nil, errors.New("no repo path provided")
	}
	repoPath = strings.TrimPrefix(repoPath, "file://")

	// lock
	s.mu.Lock()
	defer s.mu.Unlock()

	// if a node for the repo is already started, just return it's id
	if nw, ok := s.nodesByRepo[repoPath]; ok {
		return &StartNodeResponse{
			Id:            nw.id,
			GatewayMaddrs: []string{nw.gatewayMaddr},
			ApiMaddrs:     []string{nw.apiMaddr},
		}, nil
	}

	// start a fresh node, creating the repo if necessary
	_, nodeName := path.Split(repoPath)
	node, err := startIPFSNode(repoPath, nil, nil, s.logger.Named(nodeName))
	if err != nil {
		return nil, errors.Wrap(err, "start IPFS node")
	}

	// serve apis
	gatewayMaddr, err := node.ServeGatewayMultiaddr("/ip4/127.0.0.1/tcp/4242", true)
	if err != nil {
		_ = node.Close()
		return nil, errors.Wrap(err, "serve gateway")
	}
	apiMaddr, err := node.ServeAPIMultiaddr("/ip4/127.0.0.1/tcp/5001")
	if err != nil {
		_ = node.Close()
		return nil, errors.Wrap(err, "serve api")
	}

	// generate an unique id and store the node conveniently
	nw, err := newNodeWrapper(repoPath, node, apiMaddr, gatewayMaddr)
	if err != nil {
		_ = node.Close()
		return nil, errors.Wrap(err, "create IPFS node wrapper")
	}
	s.nodesByID[nw.id] = nw
	s.nodesByRepo[nw.repoPath] = nw

	// return id
	return &StartNodeResponse{
		Id:            nw.id,
		GatewayMaddrs: []string{gatewayMaddr},
		ApiMaddrs:     []string{apiMaddr},
	}, nil
}

func (s *Server) StopNode(ctx context.Context, req *StopNodeRequest) (*StopNodeResponse, error) {
	// check args
	id := req.GetId()
	if id == "" {
		return nil, errors.New("no node id provided")
	}

	// lock
	s.mu.Lock()
	defer s.mu.Unlock()

	// return if node is not started
	nw, ok := s.nodesByID[id]
	if !ok {
		return &StopNodeResponse{}, nil
	}

	// close node
	if err := nw.node.Close(); err != nil {
		return nil, err
	}

	// delete node from indexes
	delete(s.nodesByID, id)
	delete(s.nodesByRepo, nw.repoPath)
	return &StopNodeResponse{}, nil
}

func (s *Server) Close() error {
	var err error

	// lock
	s.mu.Lock()
	defer s.mu.Unlock()

	// close nodes
	for _, nw := range s.nodesByID {
		err = multierr.Append(err, nw.node.Close())
	}

	// return errors if any
	return err
}

func startIPFSNode(repoPath string, initialConfig *mobileipfs.Config, proxDriver mobileipfs.ProximityDriver, logger *zap.Logger) (*mobileipfs.Node, error) {
	if !mobileipfs.RepoIsInitialized(repoPath) {
		if initialConfig == nil {
			var err error
			if initialConfig, err = mobileipfs.NewDefaultConfig(); err != nil {
				return nil, errors.Wrap(err, "get default IPFS config")
			}
		}
		if err := mobileipfs.InitRepo(repoPath, initialConfig); err != nil {
			return nil, errors.Wrap(err, fmt.Sprintf("init repo at '%s'", repoPath))
		}
	}
	repo, err := mobileipfs.OpenRepo(repoPath)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("open repo at '%s'", repoPath))
	}
	node, err := mobileipfs.NewNode(repo, proxDriver)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("instanciate node with repo at '%s'", repoPath))
	}
	return node, nil
}

type nodeWrapper struct {
	node         *mobileipfs.Node
	repoPath     string
	id           string
	apiMaddr     string
	gatewayMaddr string
}

func NewID() (string, error) {
	b := make([]byte, 32)
	if _, err := crand.Read(b); err != nil {
		return "", errors.Wrap(err, "generate random bytes")
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func newNodeWrapper(repoPath string, node *mobileipfs.Node, gatewayMaddr string, apiMaddr string) (*nodeWrapper, error) {
	id, err := NewID()
	if err != nil {
		return nil, errors.Wrap(err, "create new ID")
	}
	return &nodeWrapper{
		repoPath:     repoPath,
		node:         node,
		id:           id,
		apiMaddr:     apiMaddr,
		gatewayMaddr: gatewayMaddr,
	}, nil
}

func SafeLogger(l *zap.Logger) *zap.Logger {
	if l == nil {
		l = zap.NewNop()
	}
	return l
}

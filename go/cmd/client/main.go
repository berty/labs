package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"os"

	"berty.tech/labs/go/pkg/blmod"
	"moul.io/u"

	// grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	ma "github.com/multiformats/go-multiaddr"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	fs := flag.NewFlagSet("berty-labs-client", flag.ExitOnError)
	var (
		maddrFlag = fs.String("maddr", "/ip4/127.0.0.1/tcp/9314", "labs instance address")
		runFlag   = fs.String("run", "", "run a module by name")
		argsFlag  = fs.String("args", "", "module argument(s)")
		_         = fs.String("config", "berty_labs_client.conf", "config file (optional)")
	)
	ff.Parse(fs, os.Args[1:],
		ff.WithEnvVarPrefix("BERTY_LABS_CLIENT"),
		ff.WithConfigFileFlag("config"),
		ff.WithConfigFileParser(ff.PlainParser),
	)

	/*
		logger, err := zap.NewDevelopment()
		if err != nil {
			panic(err)
		}
		grpc_zap.ReplaceGrpcLoggerV2(logger.Named("grpc"))
	*/

	addr, err := maddrToAddr(*maddrFlag)
	if err != nil {
		panic(errors.Wrap(err, "convert maddr"))
	}
	// log.Println("lab address:", addr)

	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("fail to dial: %v", err)
	}
	defer conn.Close()

	if *runFlag != "" {
		client := blmod.NewLabsModulesServiceClient(conn)
		args := []byte(nil)
		if len(*argsFlag) != 0 {
			args = []byte(*argsFlag)
		}
		cl, err := client.RunModule(context.Background(), &blmod.RunModuleRequest{
			Name: *runFlag,
			Args: args,
		})
		if err != nil {
			log.Fatalf("fail to start running module: %v", err)
		}
		for {
			reply, err := cl.Recv()
			if err == io.EOF {
				break
			}
			payload := reply.GetPayload()
			var data interface{}
			if err := json.Unmarshal(payload, &data); err != nil {
				fmt.Println(string(payload))
			} else {
				fmt.Println(data)
			}
		}
		return
	}

	client := blmod.NewLabsModulesServiceClient(conn)
	allModulesReply, err := client.AllModules(context.TODO(), &blmod.AllModulesRequest{})
	if err != nil {
		log.Fatalf("fail to list modules: %v", err)
	}
	fmt.Println(u.PrettyJSON(allModulesReply.GetModules()))
}

func maddrToAddr(maddrStr string) (string, error) {
	maddr, err := ma.NewMultiaddr(maddrStr)
	if err != nil {
		return "", errors.Wrap(err, "invalid maddr")
	}
	protocols := maddr.Protocols()
	rootProtocol := protocols[0]
	if rootProtocol.Name != "ip4" && rootProtocol.Name != "ip6" {
		return "", fmt.Errorf("protocol '%s' not supported, expected 'ip4' or 'ip6'", rootProtocol.Name)
	}
	host, err := maddr.ValueForProtocol(rootProtocol.Code)
	if err != nil {
		return "", errors.Wrap(err, "get address host")
	}
	nextProtocol := protocols[1]
	if nextProtocol.Name != "tcp" {
		return "", errors.Wrap(err, "transport '%s' not supported, expected 'tcp'")
	}
	port, err := maddr.ValueForProtocol(nextProtocol.Code)
	if err != nil {
		return "", errors.Wrap(err, "get address port")
	}
	return fmt.Sprintf("%s:%s", host, port), nil
}

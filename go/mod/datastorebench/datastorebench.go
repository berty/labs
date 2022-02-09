package datastorebench

import (
	"context"
	crand "crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"strings"
	"time"

	"berty.tech/labs/go/pkg/blmod"
	chunk "github.com/ipfs/go-ipfs-chunker"
	_ "github.com/mutecomm/go-sqlcipher/v4"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

type module struct {
	blmod.UnimplementedModule

	logger *zap.Logger
}

var _ blmod.Module = (*module)(nil)

func New() (blmod.Module, error) {
	return &module{}, nil
}

var _ blmod.ModuleFactory = New

func (m *module) Info() (*blmod.ModuleInfo, error) {
	return &blmod.ModuleInfo{
		Name:             "datastorebench",
		DisplayName:      "Datastores Benchmark",
		IconKind:         blmod.ModuleInfo_ICON_KIND_UTF,
		IconData:         ([]byte)("🏬"),
		ShortDescription: "Benchmark datastore implementations",
	}, nil
}

var (
	ErrCancelled = errors.New("cancelled")
)

func randomBytes(size int) ([]byte, error) {
	buf := make([]byte, size)
	if _, err := io.ReadFull(crand.Reader, buf); err != nil {
		return nil, err
	}
	return buf, nil
}

func (m *module) Run(ctx context.Context, args []byte, mc blmod.ModuleContext) error {
	count := 1000
	if len(args) != 0 {
		if err := json.Unmarshal(args, &count); err != nil {
			return errors.Wrap(err, "unmarshal count")
		}
	}

	payload, err := randomBytes(int(chunk.DefaultBlockSize))
	if err != nil {
		return errors.Wrap(err, "generate payload")
	}

	for _, desc := range datastores {
		keyFromIndex := desc.KeyFromIndex
		if keyFromIndex == nil {
			keyFromIndex = DefaultKeyFromIndex
		}

		if err := mc.Send("Datastore: " + desc.Name); err != nil {
			return err
		}

		if err := func() error {
			tmpDir, err := ioutil.TempDir(os.TempDir(), "dsbench_"+desc.Name)
			if err != nil {
				return errors.Wrap(err, "get temp dir")
			}
			defer func() {
				if err := os.RemoveAll(tmpDir); err != nil {
					m.logger.Error("failed to remove temporary directory", zap.String("path", tmpDir), zap.Error(err))
				}
			}()

			ds, err := desc.Factory(tmpDir)
			if err != nil {
				return errors.Wrap(err, desc.Name+" factory")
			}
			defer func() {
				if err := ds.Close(); err != nil {
					m.logger.Error("failed to remove temporary directory", zap.String("path", tmpDir), zap.Error(err))
				}
			}()

			time.Sleep(time.Second * 3) // let system settle a bit
			startTime := time.Now()
			fails, err := basicPuts(ctx, ds, keyFromIndex, count, payload)
			doneTime := time.Now()

			if err == ErrCancelled {
				return err
			}
			dur := doneTime.Sub(startTime)
			reportLines := []string{fmt.Sprintf("  Benchmark: basicPuts %d", count)}
			reportLines = append(reportLines, fmt.Sprintf("  Duration: %v/op, %v total", dur/time.Duration(count), dur))
			if err != nil {
				reportLines = append(reportLines,
					fmt.Sprintf("Fails: %d/%d", fails, count),
					"Errors:",
					fmt.Sprint(err),
				)
			}
			if err := mc.Send(strings.Join(reportLines, "\n")); err != nil {
				return err
			}
			return nil
		}(); err != nil {
			if err == ErrCancelled {
				return err
			}
			if err := mc.Send(fmt.Sprintf("Error: %v", err)); err != nil {
				return err
			}
		}
	}

	return nil
}

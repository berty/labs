package datastorebench

import (
	"path/filepath"
	"strconv"

	"github.com/ipfs/go-datastore"
	badgerds "github.com/ipfs/go-ds-badger"
	badger2ds "github.com/ipfs/go-ds-badger2"
	flatds "github.com/ipfs/go-ds-flatfs"
	levelds "github.com/ipfs/go-ds-leveldb"
	sqliteds "github.com/ipfs/go-ds-sql/sqlite"
	"github.com/pkg/errors"
	leveldbopt "github.com/syndtr/goleveldb/leveldb/opt"
)

type DatastoreDesc struct {
	Name         string
	Factory      DatastoreFactory
	KeyFromIndex KeyFromIndex
	Encrypted    bool
}

type DatastoreFactory = func(tmpDir string) (datastore.Datastore, error)

type KeyFromIndex = func(i int) datastore.Key

func DefaultKeyFromIndex(i int) datastore.Key {
	return datastore.NewKey(strconv.Itoa(i))
}

var datastores = []*DatastoreDesc{
	{
		Name: "SQLite",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			dsn := filepath.Join(tmpDir, "ds.sqlite")
			return (&sqliteds.Options{
				DSN: dsn,
			}).Create()
		},
	},
	{
		Name: "SQLCipher",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			dsn := filepath.Join(tmpDir, "encds.sqlite")
			key, err := randomBytes(32)
			if err != nil {
				return nil, errors.Wrap(err, "generate datastore key")
			}
			return (&sqliteds.Options{
				DSN: dsn,
				Key: key,
			}).Create()
		},
		Encrypted: true,
	},
	{
		Name: "FlatFS",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			// tries to be iso with IPFS default config
			dsPath := filepath.Join(tmpDir, "ds.flatfs")
			return flatds.CreateOrOpen(dsPath,
				flatds.IPFS_DEF_SHARD,
				true,
			)
		},
	},
	{
		Name: "LevelDB",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			// tries to be iso with IPFS default config
			dsPath := filepath.Join(tmpDir, "ds.leveldb")
			return levelds.NewDatastore(dsPath, &levelds.Options{
				Compression: leveldbopt.NoCompression,
			})
		},
	},
	{
		Name: "Badger",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			dsPath := filepath.Join(tmpDir, "ds.badger")
			return badgerds.NewDatastore(dsPath, nil)
		},
	},
	{
		Name: "Badger 2",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			dsPath := filepath.Join(tmpDir, "ds.badger2")
			return badger2ds.NewDatastore(dsPath, nil)
		},
	},
	{
		Name: "Encrypted Badger 2",
		Factory: func(tmpDir string) (datastore.Datastore, error) {
			dsPath := filepath.Join(tmpDir, "encds.badger2")

			opts := badger2ds.DefaultOptions

			key, err := randomBytes(32)
			if err != nil {
				return nil, errors.Wrap(err, "generate datastore key")
			}
			opts.EncryptionKey = key

			return badger2ds.NewDatastore(dsPath, &opts)
		},
		Encrypted: true,
	},
}

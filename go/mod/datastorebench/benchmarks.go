package datastorebench

import (
	"context"

	"github.com/ipfs/go-datastore"
	"go.uber.org/multierr"
)

func basicPuts(ctx context.Context, ds datastore.Datastore, keyFromIndex KeyFromIndex, count int, data []byte) (int, error) {
	fails := 0
	var merr error
	for i := 0; i < count; i++ {
		if err := ds.Put(ctx, keyFromIndex(i), data); err != nil {
			fails++
			merr = multierr.Append(merr, err)
		}
		if count%1000 == 0 {
			select {
			case <-ctx.Done():
				return -1, ErrCancelled
			default:
			}
		}
	}
	merr = multierr.Append(merr, ds.Sync(ctx, datastore.NewKey("/")))
	return fails, merr
}

import { grpc } from '@improbable-eng/grpc-web'

export const grpcPromise = <M extends string, C extends { [key in M]: (...args: any) => any }>(
	client: C,
	method: M,
	req: Parameters<C[M]>[0],
) => {
	return new Promise<Parameters<Parameters<C[M]>[1]>[1]>((resolve, reject) => {
		const cb = (
			err: Parameters<Parameters<C[M]>[1]>[0],
			reply: Parameters<Parameters<C[M]>[1]>[1],
		) => {
			if (err) {
				reject(err)
			} else {
				resolve(reply)
			}
		}
		client[method](req, new grpc.Metadata(), cb)
	})
}

// version B requires the method to have a bound `this` (like a lambda)
export const boundGRPCPromise = <M extends (...args: any) => any>(
	method: M,
	req: Parameters<M>[0],
) => {
	return new Promise<Parameters<Parameters<M>[1]>[1]>((resolve, reject) => {
		const cb = (err: Parameters<Parameters<M>[1]>[0], reply: Parameters<Parameters<M>[1]>[1]) => {
			if (err) {
				reject(err)
			} else {
				resolve(reply)
			}
		}
		method(req, new grpc.Metadata(), cb)
	})
}

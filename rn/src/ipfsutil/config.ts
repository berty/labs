export type AnySpec = MountSpec | MeasureSpec | FlatFSSpec | LevelDSSpec

export type MountSpec = {
	mounts?: (AnySpec & { mountpoint: string })[]
	type: 'mount'
}

export type MeasureSpec = {
	child: AnySpec
	prefix?: string
	type: 'measure'
}

export type FlatFSSpec = {
	path?: string
	shardFunc?: string
	sync?: boolean
	type: 'flatfs'
}

export type LevelDSSpec = {
	compression?: string
	path?: string
	type: 'levelds'
}

export type IPFSConfig = {
	Identity?: {
		PeerID?: string
		PrivKey?: string
	}
	Datastore?: {
		StorageMax?: string
		StorageGCWatermark?: number
		GCPeriod?: string
		Spec?: AnySpec
		HashOnRead?: boolean
		BloomFilterSize?: number
	}
	Discovery?: {
		MDNS?: {
			Enabled?: boolean
			Interval?: number
		}
	}
}

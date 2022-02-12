import { TextDecoder, TextEncoder } from 'text-encoding'
import { Buffer } from 'buffer'

const utf8Encoder = new TextEncoder()
const utf8Decoder = new TextDecoder()
export const utf8 = {
	encode: utf8Encoder.encode.bind(utf8Encoder),
	decode: utf8Decoder.decode.bind(utf8Decoder),
}

export const base64 = {
	encode: (input?: string | undefined) =>
		input ? new Uint8Array(Buffer.from(input, 'base64')) : new Uint8Array(),
	decode: (input?: Uint8Array) => (input ? Buffer.from(input).toString('base64') : ''),
}

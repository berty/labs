# react-native-gomobile-ipfs

React Native bindings for [ipfs-shipyard/gomobile-ipfs](https://github.com/ipfs-shipyard/gomobile-ipfs)

## Getting started

`$ yarn add react-native-gomobile-ipfs`

### Android

Add gomobile-ipfs maven repository to your `android/build.gradle` repositories section

```groovy
maven {
  url 'https://dl.bintray.com/berty/gomobile-ipfs-android'
}
```

## Usage
```javascript
// Import library
import {IPFS} from 'react-native-gomobile-ipfs';

// Create instance of IPFS. Use one instance per app.
const ipfs = await IPFS.create();

// Start IPFS instance. It will connect to the network.
await ipfs.start();

// Create IPFS request. Check IPFS HTTP API docs.
var req = await ipfs.newRequest('cat');

// Add argument to request
req = await req.withArgument('/ipns/xkcd.hacdias.com/0176/image.png');

// Send request.
const image = await req.send();

// Remove request object from memory. Don't forget or you will have memory leak.
// IPFS object also has `free` method.
await req.free();

// Print binary data of the image
console.log('Image', data);
```

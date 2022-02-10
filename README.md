<h1 align="center">
<br>
  <img src="https://berty.tech/img/berty.svg" alt="Yolo - The Berty Project" height="300px">
  <br>
</h1>

<h3 align="center">Berty is a secure peer-to-peer messaging app that works with or without internet access, cellular data or trust in the network</h3>

<p align="center">
    <a href="https://berty.tech"><img alt="Made by Berty Technologies" src="https://assets.berty.tech/files/badge--10.svg" /></a>
    <a href="https://crpt.fyi/berty-discord"><img alt="discord" src="https://img.shields.io/badge/discord-gray?logo=discord" /></a>
    <a href="https://github.com/berty"><img alt="github" src="https://img.shields.io/badge/@berty-471961?logo=github" /></a>
    <a href="https://twitter.com/berty"><img alt="twitter" src="https://img.shields.io/twitter/follow/berty?label=%40berty&style=flat&logo=twitter" /></a>
    <a href="https://pkg.go.dev/berty.tech/REPLACEME?tab=subdirectories"><img alt="go.dev reference" src="https://img.shields.io/badge/go.dev-reference-007d9c?logo=go&logoColor=white" /></a>
    <a href="https://github.com/berty/REPLACEME/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/berty/REPLACEME" /></a>

</p>

> TODO: short headline.

TODO: short intro for non-tech. what is this repo about.

TODO: optional clarification for techs, if the short intro is not enough to understand what is this repo about.

## Install

TODO

## Getting Started

See [Modules](#modules) if you don't want to dive into the code

### Troubleshooting

_(please use [issues](https://github.com/berty/REPLACEME))_

## Development

If you want to quickly try native mobile IPFS without writing any go, make an [HTML module](#html-module)

### Architecture

TODO: Explain modules architecture

## Modules<a id='modules'></a>

Modules are automatically added to the home tool list in the app

They allow you to run custom Go or JavaScript and programatically access a Gomobile-IPFS backed IPFS shell on mobile very quickly

You don't need to know JavaScript to create or run a Go module and you don't need to know Go to create or run a JavaScript module

### HTML<a id='html-module'></a>

HTML modules in a nutshell:
- Living at `rn/html-mods/`
- Statically served at the root of a Go `http.FileServer` started automatically by the Labs bridge
- Accessed with a `react-native-webview` pointed at the embedded static server (the `rn/src/screens/HTMLModule.tsx` screen)
- If the build of an HTML module fails, it will be skipped and building the app will continue

Create a new Labs HTML module by running

```sh
cd rn
make create-module
```

And choosing one of `bare`, `git` or `react`

It will ask you a few questions and create the module boilerplate, every step is logged so you can understand what is going on

If you choose the `react` preset, you can use the dev-server from mobile with the `Browser` Labs tool

Or:
- Create a directory at `rn/html-mods/<your-module-name>`
- Add a Makefile at `rn/html-mods/<your-module-name>/Makefile` with the first rule creating:
  - The `rn/html-mods.bundle/<your-module-name>/index.html` root site file
  - The `rn/html-mods.bundle/<your-module-name>/info.json` file containing a JSON representation of the `blmod.ModuleInfo` type

### Go

Go modules in a nutshell:
- Living at `go/mod/`
- Need to be registered in `go/bind/labs/modules.go` which can be done automatically by running `make generate`
- Accessed with a generic UI that allows to run them, cancel runs and view their output (the `rn/src/screens/GoModule.tsx` screen)
- If the build of a registered Go module fails, it will abort building the app

Create a new Labs Go module by running

```sh
cd rn
make create-module
```

And choosing `go` as preset

Or:
- Create a Go module at `go/mod/<your-module-name>`
- Implement the `berty.tech/labs/go/pkg/blmod.Module` interface
- Register the module in `go/bind/labs/modules.go`

To develop a Go module faster, you can:
- `go run ./go/cmd/daemon` to spawn a CLI Labs instance
- `go run ./go/cmd/client` to access the modules with a CLI

### Testing

TODO

## Contributing

[![Contribute to Berty](https://assets.berty.tech/files/contribute-contribute_v2--Contribute-berty-ultra-light.gif)](https://github.com/berty/community)

If you want to help out, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

This repository falls under the Berty [Code of Conduct](https://github.com/berty/community/blob/master/CODE_OF_CONDUCT.md).

You can contact us on the [`#dev-💻`](https://crpt.fyi/berty-dev-discord) channel on [discord](https://crpt.fyi/berty-discord).

## License

Dual-licensed under [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) and [MIT](https://opensource.org/licenses/MIT) terms.

`SPDX-License-Identifier: (Apache-2.0 OR MIT)`

See the [COPYRIGHT](./COPYRIGHT) file for more details.

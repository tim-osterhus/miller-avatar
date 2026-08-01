# Third-party notices

This checkpoint ledger covers the five direct packages declared by
`Web/package.json`. It does not cover their full transitive dependency graph.
A08 must close the transitive SBOM and emitted-code notice set before a live
renderer ships.

## Direct package ledger

### TypeScript 7.0.2

- Repository: [microsoft/TypeScript](https://github.com/microsoft/TypeScript).
- Inclusion: build-only compiler for TypeScript source and contract tests.
- License: Apache License 2.0, Copyright Microsoft Corporation.
- Notice obligation: a redistribution of TypeScript must include the Apache
  2.0 license, retain applicable notices, identify modified files, and include
  any upstream NOTICE material required by section 4.
- Current distribution: TypeScript source and executables are not emitted into
  `Resources/Web/`.

### esbuild 0.28.1 and @esbuild/darwin-arm64 0.28.1

- Repository: [evanw/esbuild](https://github.com/evanw/esbuild).
- Inclusion: build-only JavaScript package and pinned darwin-arm64 executable
  used to produce the committed browser bundle.
- License: MIT License, Copyright Evan Wallace.
- Notice obligation: a redistribution of either package or a substantial
  portion must retain the upstream copyright and MIT permission notice.
- Current distribution: neither package nor the native executable is emitted
  into `Resources/Web/`.

### three 0.180.0

- Repository: [mrdoob/three.js](https://github.com/mrdoob/three.js).
- Inclusion: pinned future dependency for the required renderer backend seam.
  The current TypeScript entry point does not import it.
- License: MIT License, Copyright three.js authors.
- Notice obligation: a future redistribution of Three.js or a substantial
  portion must retain the upstream copyright and MIT permission notice.
- Current distribution: Three.js code, examples, fonts, decoders, and assets
  are not emitted into `Resources/Web/`.

### @pixiv/three-vrm 3.5.5

- Repository: [pixiv/three-vrm](https://github.com/pixiv/three-vrm).
- Inclusion: pinned future dependency for the VRM 1.0 backend seam. The
  current TypeScript entry point does not import it.
- License: MIT License, Copyright pixiv Inc.
- Notice obligation: a future redistribution of three-vrm or a substantial
  portion must retain the upstream copyright and MIT permission notice.
- Current distribution: three-vrm code and its transitive packages are not
  emitted into `Resources/Web/`.

The current five-file bundle contains first-party testable-core code only. It
contains no third-party runtime code or avatar asset. This statement does not
approve the direct packages, transitive packages, or related assets for A08.

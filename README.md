# Miller Avatar

Miller Avatar is the planned optional avatar-presentation package for Miller.
It will let Miller project assistant lifecycle state through configurable
visual renderers without making presentation authoritative for conversation,
reasoning, speech, or tool state.

The package is being developed in parallel with Miller and will not block the
base assistant's first release. Miller must remain fully usable when this
package is absent, disabled, loading, or unavailable.

## Initial scope

The first live 3D compatibility target is VRM 1.0 with user-supplied models
and animations. Legacy VRM 0.x compatibility is deferred until the VRM 1.0
path is proven. The package name is intentionally renderer-neutral so later
presentation formats can be added without renaming the product.

No renderer, implementation language, UI framework, model, animation pack, or
example avatar has been selected yet.

## Asset posture

Miller Avatar will not assume that a permissive renderer license clears
models, textures, animations, fonts, sounds, or other distributed assets.
Every bundled example asset must have independently verified commercial-use
and redistribution rights, provenance, attribution requirements, and hashes.

User-supplied assets remain separate from Miller Avatar's own license.

See `PROVENANCE.md` and `THIRD_PARTY_NOTICES.md`.

## License

Miller Avatar is licensed under the Apache License 2.0. See `LICENSE` and
`NOTICE`.

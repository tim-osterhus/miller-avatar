# Provenance policy

Miller Avatar starts as a clean repository. It does not inherit source code,
tests, assets, or Git history from Cortana Assistant, VoiceInk, the private
Cortana avatar, or any prospective donor project.

## Contributions and borrowed work

Before third-party source or assets enter Miller Avatar, record:

- the upstream project or asset and canonical source URL;
- the exact version, tag, commit, or immutable asset revision;
- the license and copyright notices;
- which files or assets were incorporated;
- whether the material was copied, adapted, bundled, or used only as a
  reference;
- the modifications made in Miller Avatar;
- relevant transitive dependencies and distribution requirements;
- cryptographic hashes for every distributed model, animation, texture, font,
  sound, or other binary asset.

Preserve all notices required by the upstream license in
`THIRD_PARTY_NOTICES.md` or the applicable distributed artifact.

## Dependency and asset review

Review renderer source, transitive packages, downloaded or bundled native
binaries, avatar models, animation clips, textures, shaders, fonts, sounds,
artwork, and example packs separately. A permissive repository or renderer
license does not establish that every distributed asset is safe to use.

Miller Avatar must not incorporate copyleft, noncommercial, source-available,
field-of-use-restricted, or unknown-license source code or assets.

User-supplied assets are not covered by Miller Avatar's Apache-2.0 license.
Miller Avatar must represent their provenance and validation status honestly
and must not imply redistribution permission.

## Clean-room boundary

Cortana Assistant and its private avatar may inform behavioral requirements
and performance stress tests, but their implementation and assets must not be
copied into Miller Avatar without a separate file-level authorship and
provenance review.

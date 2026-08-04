# Local fixtures

This directory is reserved for developer-supplied test inputs. Do not commit
VRM, GLB, VRMA, model, animation, texture, or other third-party asset binaries.
Fixture rights and provenance must be reviewed before any fixture is added.

Automated admission tests build synthetic GLB bytes in memory. Keep those
fixtures source-only; do not write generated avatar binaries into this tree.

The public automated gate rejects `.vrm`, `.glb`, `.vrma`, `.png`, `.jpeg`,
`.jpg`, `.heic`, and `.webp` files, private fixture path tokens, and retained
private fixture hashes in this directory and in the rest of the public tree.
The ignored generated tree is scanned separately with the same extension
policy. Public tests must construct synthetic bytes in memory or in test-owned
temporary roots.

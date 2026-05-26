import * as semver from 'semver'

// parseVersion returns the input tag if its semver portion is valid. The
// semver portion is everything after the last slash, or the whole tag if
// there is no slash. The action passes the tag through verbatim, so any
// path prefix is left to git's ref-format check (server-side) to validate.
// This supports Go's multi-module repos, which require subdirectory-modules
// to be tagged like sub/dir/vX.Y.Z (https://go.dev/ref/mod#vcs-version).
export function parseVersion(tag: string): string | null {
  const lastSlash = tag.lastIndexOf('/')
  const version = lastSlash === -1 ? tag : tag.slice(lastSlash + 1)
  return semver.valid(version) == null ? null : tag
}

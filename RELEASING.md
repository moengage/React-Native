# Release Process

- While working on a feature, add the changelog entry to the **pending block at
  the very top** of the module's `CHANGELOG.md`. The release automation only
  reads entries between a `## Release Version` header and the next `#` header —
  a tagged entry without this block is invisible and the module is **silently
  skipped** from the release:

  ```markdown
  # Release Date

  ## Release Version

  - iOS
    - [minor] What changed on iOS
  - Android
    - [patch] What changed on Android
  ```

  Format rules (enforced in CI by `scripts/validate-changelogs.js`):
  - Valid tags: `[major]`, `[minor]`, `[patch]` (lowercase; `[NA]` for
    entries that alone should not trigger a release).
  - **No colon after the tag** — the release strips the literal `" [minor]"`,
    so `- [minor] : Text` would be published as `- : Text`. Write
    `- [minor] Text`.
  - Platform grouping bullets (`- iOS`, `- Android`) carry no tag; put the tag
    on the nested entry lines.
  - The literal words `Release Date` / `Release Version` are replaced with the
    actual date and version by the release workflow — don't fill them in.
- Merge the feature / bug fixes branches into development
- Update the peer dependencies for [applicable packages](sdk) if major release is planned
- Trigger the release workflow from `development`

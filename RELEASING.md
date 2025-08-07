# Release Process

- While working on feature update the changelog in the format of
  - [Release Type (major / minor / patch)] : Changelog Content
- Merge the feature / bug fixes branches into development
- Update the peer dependencies for [applicable packages](sdk) if major release is planned
- Update the changelog with below header

  # Release Date

  ## Release Version

- Trigger the release workflow from `development`

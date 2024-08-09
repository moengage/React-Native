# Release Process

- Cut out a branch from the `development` branch for any feature/bugfix. 
- On QA completion merge the branch to the `development` branch.
- Once all the items are ready for release update the `Changelog.md` and `package.json` files of the plugins to be released and push to the `development` branch(might have to raise a PR, depends on access level).
- Trigger the Release Plugins action to publish the updated plugins to npm.
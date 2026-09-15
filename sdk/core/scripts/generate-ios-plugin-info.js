#!/usr/bin/env node
/**
 * Regenerates iOS/MoEReactBridge/MoEngageReactPluginInfo.h from package.json.
 *
 * CocoaPods regenerates this header on every `pod install` via the podspec's
 * prepare_command, but Swift Package Manager consumers compile the file that
 * ships in the npm tarball. Running this from the `prepack` npm hook keeps the
 * published header in sync with the package version.
 */
const fs = require('fs');
const path = require('path');

const pkg = require(path.join(__dirname, '..', 'package.json'));
const header = [
  '// Generated file, do not edit',
  `#define MOE_REACT_PLUGIN_VERSION @"${pkg.version}"`,
  '#define MOE_REACT_PLUGIN_NAME @"react_native"',
  '',
].join('\n');

const headerPath = path.join(
  __dirname,
  '..',
  'iOS',
  'MoEReactBridge',
  'MoEngageReactPluginInfo.h'
);
fs.writeFileSync(headerPath, header);
console.log(`Generated ${path.relative(process.cwd(), headerPath)} (version ${pkg.version})`);

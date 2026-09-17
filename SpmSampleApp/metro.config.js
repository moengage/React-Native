const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * The MoEngage packages are file:-linked from ../sdk (symlinks in
 * node_modules), so Metro must watch the real directory too, and modules
 * imported from those packages (e.g. @babel/runtime helpers) must resolve
 * against this app's node_modules — outside the project root, Metro's
 * default upward walk from ../sdk would never reach it.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, '..', 'sdk')],
  resolver: {
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

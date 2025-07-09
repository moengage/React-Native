/**
 * Mock implementation of @expo/config-plugins to help with testing
 */

const withInfoPlist = jest.fn((config, action) => {
  const plistConfig = {...config, modResults: config.infoPlistResults || {}}
  config.infoPlistResults = action(plistConfig).modResults;
  return config;
});

const withEntitlementsPlist = jest.fn((config, action) => {
  const plistConfig = {...config, modResults: config.entitlementsPlistResults || {}}
  config.entitlementsPlistResults = action(plistConfig).modResults;
  return config;
});

const withXcodeProject = jest.fn((config, action) => {
  const xcodeConfig = {
    ...config,
    modResults: {
      hash: {
        project: {
          objects: {
            PBXGroup: {},
            XCBuildConfiguration: {}
          }
        }
      },
      addFile: jest.fn(),
      addPbxGroup: jest.fn((_files: any, name: string, _path: string) => {
        return {
          uuid: name,
          name: name
        };
      }),
      addBuildPhase: jest.fn(),
      addFramework: jest.fn(),
      addTarget: jest.fn((name: string, _type: string, _subfolder: string, bundleId: string) => {
        xcodeConfig.modResults.hash.project.objects.XCBuildConfiguration[name] = {
          buildSettings: { PRODUCT_NAME: `"${name}"` }
        }
        return {
          uuid: bundleId,
          name: name
        };
      }),
      addToPbxGroup: jest.fn(),
      pbxGroupByName: jest.fn(),
      pbxProjectPath: 'project.pbxproj',
      addBuildProperty: jest.fn(),
      updateBuildProperty: jest.fn(),
      ...(config.xcodeResults || {})
    }
  };
  config.xcodeResults = action(xcodeConfig).modResults;
  return config;
});

const withDangerousMod = jest.fn((config, mods) => {
  mods[1](config);
  return config;
});

module.exports = {
  ConfigPlugin: {},
  withInfoPlist,
  withEntitlementsPlist,
  withXcodeProject,
  withDangerousMod,
  IOSConfig: {
    BundleIdentifier: {
      getBundleIdentifier: jest.fn(() => 'com.test.app')
    },
    Entitlements: {
      getEntitlementsPath: jest.fn(() => '/test/project/ios/TestApp/TestApp.entitlements')
    },
    Paths: {
      getSourceRoot: jest.fn(() => '/test/project/ios/TestApp')
    },
    InfoPlist: {
      getInfoPlistPath: jest.fn(() => '/test/project/ios/TestApp/Info.plist')
    }
  },
  createRunOncePlugin: jest.fn((fn: any, _: string) => fn)
};

import { ConfigPlugin, ExportedConfigWithProps, XcodeProject, withXcodeProject } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import * as fs from 'fs';
import * as path from 'path';
import {
  MOENGAGE_IOS_RICH_PUSH_TARGET,
  MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
  MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
  MOENGAGE_IOS_RICH_PUSH_FILES,
  MOENGAGE_IOS_PUSH_TEMPLATE_FILES
} from './constants';

const plist = require('plist');

export const withMoEngageXcodeProject: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  return withXcodeProject(config, (config) => {
    if (process.env['EXPO_TV']) {
      // Skip modifications for tvOS
      console.log(`Skipping extension targets setup for tvOS`);
      return config;
    }

    const { apple } = props;
    const shouldAddRichPushExtension = apple.richPushNotificationEnabled || apple.pushNotificationImpressionTrackingEnabled || apple.pushTemplatesEnabled;

    // Get app group from plist file if specified
    let appGroupValue = ''
    try {
      const configFilePath = path.join(config.modRequest.projectRoot, props.apple.configFilePath);
      if (fs.existsSync(configFilePath)) {
        const configPlist = plist.parse(fs.readFileSync(configFilePath, 'utf8')) as { [key: string]: any };
        appGroupValue = configPlist['AppGroupName'] as string;

        if (!appGroupValue) {
          console.warn(`Missing AppGroupName key in MoEngage configuration`);
        }
      } else {
        console.warn(`MoEngage configuration does not exist`);
      }
    } catch (e) {
      console.warn(`Could not import MoEngage configuration: ${e}`);
    }

    // Initialize with an empty object if these top-level objects are non-existent.
    // This guarantees that the extension targets will have a destination.
    const objects = config.modResults.hash.project.objects;
    objects['PBXTargetDependency'] = objects['PBXTargetDependency'] || {};
    objects['PBXContainerItemProxy'] = objects['PBXContainerItemProxy'] || {};

    const groups = objects['PBXGroup'];
    const xcconfigs = objects['XCBuildConfiguration'];

    // Retrieve Swift version and code signing settings from main target to apply to dependency targets.
    let swiftVersion;
    let codeSignStyle;
    let codeSignIdentity;
    let otherCodeSigningFlags;
    let developmentTeam;
    let provisioningProfile;
    for (const configUUID of Object.keys(xcconfigs)) {
      const buildSettings = xcconfigs[configUUID].buildSettings;
      if (!swiftVersion && buildSettings && buildSettings.SWIFT_VERSION) {
        swiftVersion = buildSettings.SWIFT_VERSION;
        codeSignStyle = buildSettings.CODE_SIGN_STYLE;
        codeSignIdentity = buildSettings.CODE_SIGN_IDENTITY;
        otherCodeSigningFlags = buildSettings.OTHER_CODE_SIGN_FLAGS;
        developmentTeam = buildSettings.DEVELOPMENT_TEAM;
        provisioningProfile = buildSettings.PROVISIONING_PROFILE_SPECIFIER;
        break;
      }
    }

    // Rich Push Notification Service Extension
    if (shouldAddRichPushExtension && !config.modResults.pbxGroupByName(MOENGAGE_IOS_RICH_PUSH_TARGET)) {
      // Add the Notification Service Extension target.
      const richPushTarget = config.modResults.addTarget(
        MOENGAGE_IOS_RICH_PUSH_TARGET,
        'app_extension',
        MOENGAGE_IOS_RICH_PUSH_TARGET,
        `${config.ios?.bundleIdentifier}.${MOENGAGE_IOS_RICH_PUSH_TARGET}`,
      );

      // Add the relevant files to the PBX group.
      const moengageNotificationServiceGroup = config.modResults.addPbxGroup(
        MOENGAGE_IOS_RICH_PUSH_FILES,
        MOENGAGE_IOS_RICH_PUSH_TARGET,
        MOENGAGE_IOS_RICH_PUSH_TARGET,
      );

      for (const groupUUID of Object.keys(groups)) {
        if (typeof groups[groupUUID] === 'object'
          && groups[groupUUID].name === undefined
          && groups[groupUUID].path === undefined) {
          config.modResults.addToPbxGroup(moengageNotificationServiceGroup.uuid, groupUUID);
        }
      };

      for (const configUUID of Object.keys(xcconfigs)) {
        const buildSettings = xcconfigs[configUUID].buildSettings;
        if (buildSettings && buildSettings.PRODUCT_NAME === `"${MOENGAGE_IOS_RICH_PUSH_TARGET}"`) {
          buildSettings.MOENGAGE_APP_GROUP = appGroupValue;
          buildSettings.SWIFT_VERSION = swiftVersion;
          buildSettings.CODE_SIGN_ENTITLEMENTS = `${MOENGAGE_IOS_RICH_PUSH_TARGET}/${MOENGAGE_IOS_RICH_PUSH_TARGET}.entitlements`;
          if (codeSignStyle) { buildSettings.CODE_SIGN_STYLE = codeSignStyle; }
          if (codeSignIdentity) { buildSettings.CODE_SIGN_IDENTITY = codeSignIdentity; }
          if (otherCodeSigningFlags) { buildSettings.OTHER_CODE_SIGN_FLAGS = otherCodeSigningFlags; }
          if (developmentTeam) { buildSettings.DEVELOPMENT_TEAM = developmentTeam; }
          if (provisioningProfile) { buildSettings.PROVISIONING_PROFILE_SPECIFIER = provisioningProfile; }
        }
      }

      // Set up target build phase scripts.
      config.modResults.addBuildPhase(
        [
          'NotificationService.swift',
        ],
        'PBXSourcesBuildPhase',
        'Sources',
        richPushTarget.uuid
      );

      config.modResults.addBuildPhase(
        ['UserNotifications.framework'],
        'PBXFrameworksBuildPhase',
        'Frameworks',
        richPushTarget.uuid
      );
    }

    // Push Templates Notification Content Extension
    if (apple.pushTemplatesEnabled && !config.modResults.pbxGroupByName(MOENGAGE_IOS_PUSH_TEMPLATE_TARGET)) {
      // Add the Notification Content Extension target.
      const pushTemplateTarget = config.modResults.addTarget(
        MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
        'app_extension',
        MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
        `${config.ios?.bundleIdentifier}.${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}`,
      );

      // Add the relevant files to the PBX group.
      const moengageNotificationContentGroup = config.modResults.addPbxGroup(
        MOENGAGE_IOS_PUSH_TEMPLATE_FILES,
        MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
        MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
      );

      for (const groupUUID of Object.keys(groups)) {
        if (typeof groups[groupUUID] === 'object'
          && groups[groupUUID].name === undefined
          && groups[groupUUID].path === undefined) {
          config.modResults.addToPbxGroup(moengageNotificationContentGroup.uuid, groupUUID);
        }
      };

      for (const configUUID of Object.keys(xcconfigs)) {
        const buildSettings = xcconfigs[configUUID].buildSettings;
        if (buildSettings && buildSettings.PRODUCT_NAME === `"${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}"`) {
          buildSettings.MOENGAGE_APP_GROUP = appGroupValue;
          buildSettings.SWIFT_VERSION = swiftVersion;
          buildSettings.CODE_SIGN_ENTITLEMENTS = `${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}/${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}.entitlements`;
          if (codeSignStyle) { buildSettings.CODE_SIGN_STYLE = codeSignStyle; }
          if (codeSignIdentity) { buildSettings.CODE_SIGN_IDENTITY = codeSignIdentity; }
          if (otherCodeSigningFlags) { buildSettings.OTHER_CODE_SIGN_FLAGS = otherCodeSigningFlags; }
          if (developmentTeam) { buildSettings.DEVELOPMENT_TEAM = developmentTeam; }
          if (provisioningProfile) { buildSettings.PROVISIONING_PROFILE_SPECIFIER = provisioningProfile; }
        }
      }

      // Set up target build phase scripts.
      config.modResults.addBuildPhase(
        [
          'NotificationViewController.swift',
        ],
        'PBXSourcesBuildPhase',
        'Sources',
        pushTemplateTarget.uuid
      );

      config.modResults.addBuildPhase(
        [
          'MainInterface.storyboard',
        ],
        'PBXResourcesBuildPhase',
        'Resources',
        pushTemplateTarget.uuid
      );

      config.modResults.addBuildPhase(
        [
          'UserNotifications.framework',
          'UserNotificationsUI.framework'
        ],
        'PBXFrameworksBuildPhase',
        'Frameworks',
        pushTemplateTarget.uuid
      );
    }

    // Handle Live Activity configuration if targetPath is provided
    if (apple.liveActivityTargetPath && apple.liveActivityTargetPath.length && !config.modResults.pbxGroupByName(MOENGAGE_IOS_LIVE_ACTIVITY_TARGET)) {
      config = withLiveActivity(config, apple.liveActivityTargetPath, {
        swiftVersion,
        codeSignStyle,
        codeSignIdentity,
        otherCodeSigningFlags,
        developmentTeam,
        provisioningProfile
      });
    }

    return config;
  });
};

// Typing for code signing settings
interface CodeSignSettings {
  swiftVersion?: string;
  codeSignStyle?: string;
  codeSignIdentity?: string;
  otherCodeSigningFlags?: string;
  developmentTeam?: string;
  provisioningProfile?: string;
}

/**
 * Adds Live Activity extension target to the Xcode project
 * @param config - Expo config with Xcode project
 * @param liveActivityTargetPath - Path to the Live Activity source files
 * @param codeSignSettings - Code signing settings to apply
 */
export function withLiveActivity(config: ExportedConfigWithProps<XcodeProject>, liveActivityTargetPath: string, codeSignSettings: CodeSignSettings) {
  const liveActivityPath = path.join(config.modRequest.projectRoot, liveActivityTargetPath);
  const objects = config.modResults.hash.project.objects;
  const xcconfigs = objects['XCBuildConfiguration'];
  const groups = objects['PBXGroup'];

  // Add the Live Activity target
  const liveActivityTarget = config.modResults.addTarget(
    MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
    'app_extension',
    MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
    `${config.ios?.bundleIdentifier}.${MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}`,
  );

  // Add the relevant files to the PBX group.
  const moengageLiveActivityPathContentGroup = config.modResults.addPbxGroup(
    [], MOENGAGE_IOS_LIVE_ACTIVITY_TARGET, liveActivityPath,
  );

  for (const groupUUID of Object.keys(groups)) {
    if (typeof groups[groupUUID] === 'object'
      && groups[groupUUID].name === undefined
      && groups[groupUUID].path === undefined) {
      config.modResults.addToPbxGroup(moengageLiveActivityPathContentGroup.uuid, groupUUID);
    }
  };

  // Find  all .xcassets files, source files, header files,
  // info plist file and entitlements file in liveActivityTargetPath
  let entitlementsFile = '';
  let infoPlistFile = '';
  let resourcesFiles: string[] = [];
  let sourceFiles: string[] = [];
  let headerFiles: string[] = [];

  try {
    const findFilesRecursively = (directory: string, group: any) => {
      let items = fs.readdirSync(directory, { withFileTypes: true });
      for (const item of items) {
        const itemPath = path.join(directory, item.name);
        const ext = path.extname(item.name).toLowerCase();
        if (item.isDirectory()) {
          if (['.xcassets'].includes(ext)) {
            resourcesFiles.push(itemPath);
            console.log(`Found ${itemPath} as resource for LiveActivity`);
          } else {
            // Recursively read directories
            const group = config.modResults.addPbxGroup([], item.name, itemPath);
            config.modResults.addToPbxGroup(group.uuid, moengageLiveActivityPathContentGroup.uuid);
            findFilesRecursively(itemPath, group);
            continue;
          }
        } else if (['.swift', '.m', '.c', '.cpp'].includes(ext)) {
          sourceFiles.push(itemPath);
          console.log(`Found ${itemPath} as source file for LiveActivity`);
        } else if (['.h'].includes(ext)) {
          headerFiles.push(itemPath);
          console.log(`Found ${itemPath} as header file for LiveActivity`);
        } else if (['.entitlements'].includes(ext)) {
          entitlementsFile = itemPath;
          console.log(`Found ${itemPath} as entitlements file for LiveActivity`);
        } else if (item.name === 'Info.plist' ||
          item.name === `${MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}-Info.plist` ||
          item.name === `${path.basename(path.dirname(liveActivityTargetPath ?? ''))}-Info.plist`) {
          infoPlistFile = itemPath;
          console.log(`Found ${itemPath} as Info.plist file for LiveActivity`);
        } else {
          resourcesFiles.push(itemPath);
          console.log(`Found ${itemPath} as resource for LiveActivity`);
        }
        // Add file to project
        config.modResults.addFile(itemPath, group.uuid);
      }
    };

    // Find all files
    findFilesRecursively(liveActivityPath, moengageLiveActivityPathContentGroup);
  } catch (e) {
    console.warn(`Error finding files in Live Activity path: ${e}`);
  }

  // Set up build settings for the Live Activity target
  for (const configUUID of Object.keys(xcconfigs)) {
    const buildSettings = xcconfigs[configUUID].buildSettings;
    if (buildSettings && buildSettings.PRODUCT_NAME === `"${MOENGAGE_IOS_LIVE_ACTIVITY_TARGET}"`) {
      buildSettings.SWIFT_VERSION = codeSignSettings.swiftVersion;
      buildSettings.IPHONEOS_DEPLOYMENT_TARGET = '18.0'; // Set minimum iOS version for Live Activity

      // Add entitlements file if found
      if (entitlementsFile && entitlementsFile.length) {
        buildSettings.CODE_SIGN_ENTITLEMENTS = `${entitlementsFile}`;
      }

      // Add Info.plist file if found
      if (infoPlistFile && infoPlistFile.length) {
        buildSettings.INFOPLIST_FILE = `${infoPlistFile}`;
      }

      // Copy code signing settings from main target
      if (codeSignSettings.codeSignStyle) { buildSettings.CODE_SIGN_STYLE = codeSignSettings.codeSignStyle; }
      if (codeSignSettings.codeSignIdentity) { buildSettings.CODE_SIGN_IDENTITY = codeSignSettings.codeSignIdentity; }
      if (codeSignSettings.otherCodeSigningFlags) { buildSettings.OTHER_CODE_SIGN_FLAGS = codeSignSettings.otherCodeSigningFlags; }
      if (codeSignSettings.developmentTeam) { buildSettings.DEVELOPMENT_TEAM = codeSignSettings.developmentTeam; }
      if (codeSignSettings.provisioningProfile) { buildSettings.PROVISIONING_PROFILE_SPECIFIER = codeSignSettings.provisioningProfile; }
    }
  }

  // Add resources (xcassets) to the target
  if (resourcesFiles.length) {
    config.modResults.addBuildPhase(
      resourcesFiles,
      'PBXResourcesBuildPhase',
      'Resources',
      liveActivityTarget.uuid
    );
  }

  // Add source files to the target
  if (sourceFiles.length) {
    config.modResults.addBuildPhase(
      sourceFiles,
      'PBXSourcesBuildPhase',
      'Sources',
      liveActivityTarget.uuid
    );
  }

  // Add header files to the target
  if (headerFiles.length) {
    config.modResults.addBuildPhase(
      headerFiles,
      'PBXHeadersBuildPhase',
      'Headers',
      liveActivityTarget.uuid
    );
  }

  // Add required frameworks for Live Activity
  config.modResults.addBuildPhase(
    [
      'SwiftUI.framework',
      'WidgetKit.framework',
      'ActivityKit.framework'
    ],
    'PBXFrameworksBuildPhase',
    'Frameworks',
    liveActivityTarget.uuid
  );

  return config;
}

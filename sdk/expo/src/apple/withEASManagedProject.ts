import {
  ConfigPlugin,
  ExportedConfigWithProps,
  withDangerousMod,
} from "@expo/config-plugins";
import { AppExtension, MoEngagePluginProps } from "../types";
import * as fs from "fs";
import * as path from "path";
import { ExpoConfig } from "@expo/config-types";
import { EasManagedExtra } from "../types";
import {
  MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
  MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
  MOENGAGE_IOS_RICH_PUSH_TARGET,
} from "./constants";
const plist = require("plist");

const isTargetAlreadyPresent = (extra: EasManagedExtra, target: string) => {
  const extension = extra.eas?.build?.experimental?.ios?.appExtensions?.find(
    (extension: { targetName?: string }) => extension.targetName === target
  );
  if (extension) {
    console.log(
      `Target '${target}' already present in eas appExtensions. Skipping appExtension autogeneration....`
    );
  }
  return Boolean(extension);
};

/**
 * Taps into the EAS build process, exposing what targets are being built
 * so EAS build an automatically generate/maintain the appropriate provisioning profiles for the app
 * More info here: https://docs.expo.dev/build-reference/app-extensions/
 */
export default function injectAppExtensionIntoEasManagedExtra(
  config: ExpoConfig,
  injectedValue: AppExtension
): EasManagedExtra {
  assertTargetNotPresent(
    config.extra as EasManagedExtra,
    injectedValue.bundleIdentifier
  );

  const easExtra = (config.extra ?? {}) as EasManagedExtra;
  easExtra.eas ??= {};
  easExtra.eas.build ??= {};
  easExtra.eas.build.experimental ??= {};
  easExtra.eas.build.experimental.ios ??= {};
  easExtra.eas.build.experimental.ios.appExtensions = [];

  config.extra = easExtra;

  return {
    ...easExtra,
    eas: {
      ...easExtra?.eas,
      build: {
        ...easExtra?.eas?.build,
        experimental: {
          ...easExtra.eas?.build?.experimental,
          ios: {
            ...easExtra.eas?.build?.experimental?.ios,
            appExtensions: [
              ...(easExtra.eas?.build?.experimental?.ios?.appExtensions ?? []),
              injectedValue,
            ],
          },
        },
      },
    },
  };
}

const getAppGroupName = (
  exportedConfig: ExportedConfigWithProps<unknown>,
  filePath: string
) => {
  try {
    const configFilePath = path.join(
      exportedConfig.modRequest.projectRoot,
      filePath
    );
    if (fs.existsSync(configFilePath)) {
      const configPlist = plist.parse(
        fs.readFileSync(configFilePath, "utf8")
      ) as { [key: string]: any };
      return configPlist["AppGroupName"] as string;
    } else {
      const message = `MoEngage configuration does not exist`;
      console.error(message);
      throw new Error(message);
    }
  } catch (e) {
    const message = `Could not import MoEngage configuration: ${e}`;
    console.error(message);
    throw new Error(message);
  }
};

export const withEASManagedProject: ConfigPlugin<MoEngagePluginProps> = (
  config,
  props
) => {
  return withDangerousMod(config, [
    "ios",
    (exportedConfig) => {
      const { apple } = props;
      let easExtra = (exportedConfig.extra ?? {}) as EasManagedExtra;
      easExtra.eas ??= {};
      easExtra.eas.build ??= {};
      easExtra.eas.build.experimental ??= {};
      easExtra.eas.build.experimental.ios ??= {};
      easExtra.eas.build.experimental.ios.appExtensions ??= [];

      const shouldAddRichPushExtension =
        apple.richPushNotificationEnabled ||
        apple.pushNotificationImpressionTrackingEnabled ||
        apple.pushTemplatesEnabled;

      const appGroupName = getAppGroupName(
        exportedConfig,
        apple.configFilePath
      );
      if (!exportedConfig.ios?.bundleIdentifier) {
        const message = `Could not find bundle identifier under 'ios' key`;
        console.error(message);
        throw new Error(message);
      }
      if (
        shouldAddRichPushExtension &&
        !isTargetAlreadyPresent(easExtra, MOENGAGE_IOS_RICH_PUSH_TARGET)
      ) {
        const richPushExtensionBundleID = `${exportedConfig.ios.bundleIdentifier}.${MOENGAGE_IOS_RICH_PUSH_TARGET}`;
        easExtra = injectAppExtensionIntoEasManagedExtra(config, {
          targetName: MOENGAGE_IOS_RICH_PUSH_TARGET,
          bundleIdentifier: richPushExtensionBundleID,
          entitlements: {
            "com.apple.security.application-groups": [appGroupName],
          },
        });
      }
      if (
        apple.pushTemplatesEnabled &&
        !isTargetAlreadyPresent(easExtra, MOENGAGE_IOS_PUSH_TEMPLATE_TARGET)
      ) {
        const templatePushBundleId = `${exportedConfig.ios.bundleIdentifier}.${MOENGAGE_IOS_PUSH_TEMPLATE_TARGET}`;
        easExtra = injectAppExtensionIntoEasManagedExtra(config, {
          targetName: MOENGAGE_IOS_PUSH_TEMPLATE_TARGET,
          bundleIdentifier: templatePushBundleId,
          entitlements: {
            "com.apple.security.application-groups": [appGroupName],
          },
        });
      }
      if (
        apple.liveActivityTargetPath &&
        apple.liveActivityTargetPath.length &&
        !isTargetAlreadyPresent(easExtra, MOENGAGE_IOS_LIVE_ACTIVITY_TARGET)
      ) {
        easExtra = injectAppExtensionIntoEasManagedExtra(config, {
          targetName: MOENGAGE_IOS_LIVE_ACTIVITY_TARGET,
          bundleIdentifier: exportedConfig.ios.bundleIdentifier,
          entitlements: {},
        });
      }
      exportedConfig.extra = easExtra;
      return exportedConfig;
    },
  ]);
};

import { ExpoConfig } from "@expo/config-types";
import { EasManagedExtra } from "../types";

/**
 * Taps into the EAS build process, exposing what targets are being built
 * so EAS build an automatically generate/maintain the appropriate provisioning profiles for the app
 * More info here: https://docs.expo.dev/build-reference/app-extensions/
 */
export default function injectAppExtensionIntoEasManagedExtra(
  config: ExpoConfig,
  injectedValue: {
    targetName: string;
    bundleIdentifier: string;
    entitlements: Record<string, string[]>;
  }
): ExpoConfig["extra"] {
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

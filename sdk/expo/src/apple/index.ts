import { ConfigPlugin } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import { withMoEngageInfoPlist } from "./withInfoPlist";
import { withMoEngageEntitlements } from "./withEntitlements";
import { withMoEngageXcodeProject } from "./withXcodeProject";
import { withMoEngageDangerousMod } from "./withDangerousMod";
import * as constants from './constants';

/**
 * The main iOS plugin that applies all modifiers to set up MoEngage iOS integration
 *
 * This is the primary entry point for the MoEngage Expo plugin for iOS.
 * It orchestrates the entire configuration process by applying each of the
 * specialized modifiers in the correct order:
 *
 * 1. withMoEngageInfoPlist - Updates Info.plist with MoEngage configuration
 * 2. withMoEngageEntitlements - Sets up app groups and other entitlements
 * 3. withMoEngageXcodeProject - Configures the Xcode project with extension targets
 * 4. withMoEngageDangerousMod - Performs file operations and updates Podfile
 *
 * @param config - The Expo config object
 * @param props - The MoEngage plugin properties
 * @returns The fully configured Expo config
 */
export const withMoEngageIos: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  config = withMoEngageInfoPlist(config, props);
  config = withMoEngageEntitlements(config, props);
  config = withMoEngageXcodeProject(config, props);
  config = withMoEngageDangerousMod(config, props);
  return config;
};

// Export all constants and individual modifiers for advanced usage
export { constants };
export { withMoEngageInfoPlist, withMoEngageEntitlements, withMoEngageXcodeProject, withMoEngageDangerousMod };

// Default export
export default withMoEngageIos;

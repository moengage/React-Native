import { ConfigPlugin } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";
import { withMoEngageInfoPlist } from "./withInfoPlist";
import { withMoEngageEntitlements } from "./withEntitlements";
import { withMoEngageXcodeProject } from "./withXcodeProject";
import { withMoEngageDangerousMod } from "./withDangerousMod";
import * as constants from './constants';

/**
 * The main iOS plugin that applies all modifiers to set up MoEngage iOS integration
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

import { ConfigPlugin } from "@expo/config-plugins";
import { MoEngagePluginProps } from "../types";

/**
 * The main iOS plugin that applies all modifiers to set up MoEngage iOS integration
 */
export const withMoEngageIos: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  console.log(props);
  return config;
};

// Default export
export default withMoEngageIos;

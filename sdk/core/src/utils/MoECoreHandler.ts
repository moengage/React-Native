import { getSelfHandledCampaignDataObj } from "../../src/moeParser/MoEInAppParser";
import MoEReactBridge from "../NativeMoEngage";
import { getAppIdJson } from "../utils/MoEJsonBuilder";

export const getSelfHandledInApps = async (appId: string) => {
  try {
    const selfHandledCampaignData = await MoEReactBridge.getSelfHandledInApps(getAppIdJson(appId));
    return getSelfHandledCampaignDataObj(selfHandledCampaignData);;
  } catch (error) {
    return null;
  }
}

import { getMoESelfHandledCampaignsDataObj } from "../../src/moeParser/MoEInAppParser";
import MoEngageLogger from "../logger/MoEngageLogger";
import MoEReactBridge from "../NativeMoEngage";
import { getAppIdJson } from "../utils/MoEJsonBuilder";

export const getSelfHandledInApps = async (appId: string) => {
  try {
    const selfHandledCampaignsData = await MoEReactBridge.getSelfHandledInApps(getAppIdJson(appId));
    const retVal = getMoESelfHandledCampaignsDataObj(selfHandledCampaignsData);
    return retVal;
  } catch (error) {
    MoEngageLogger.error("getSelfHandledInApps: error parsing $error", error);
    return null;
  }
}

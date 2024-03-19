import { MoEngagePermissionType } from "./MoEngagePermissionType";
import {MoEPlatform} from "./MoEPlatform";

export default class MoEngagePersimissionResultData {
    platform: MoEPlatform;
    isGranted: boolean;
    type: MoEngagePermissionType;

    constructor(platform: MoEPlatform, isGranted: boolean, type: MoEngagePermissionType) {
        this.platform = platform;
        this.isGranted = isGranted;
        this.type = type;
    }
}
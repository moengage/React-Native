import { MoEMediaType } from "./MoEMediaType";
import { MoEAccessibilityData } from "react-native-moengage";

export default class MoEMedia {
  mediaType: MoEMediaType;
  url: string;
  accessibilityData?: MoEAccessibilityData | undefined;
  
  constructor(mediaType: MoEMediaType, url: string, accessibilityData?: MoEAccessibilityData) {
    this.mediaType = mediaType;
    this.url = url;
    this.accessibilityData = accessibilityData;
  }
}
import { MoEMediaType } from "./MoEMediaType";
import { MoEAccessibilityData } from "react-native-moengage";

export default class MoEMedia {
  mediaType: MoEMediaType;
  url: string;
  accessibilityData: MoEAccessibilityData | null;
  
  constructor(mediaType: MoEMediaType, url: string, accessibilityData: MoEAccessibilityData | null) {
    this.mediaType = mediaType;
    this.url = url;
    this.accessibilityData = accessibilityData;
  }
}
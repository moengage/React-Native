import { MoEMediaType } from "./MoEMediaType";

export default class MoEMedia {
  mediaType: MoEMediaType;
  url: string;
  constructor(mediaType: MoEMediaType, url: string) {
    this.mediaType = mediaType;
    this.url = url;
  }
}
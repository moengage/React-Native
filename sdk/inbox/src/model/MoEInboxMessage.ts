import MoETextContent from "./MoETextContent";
import MoEMedia from "./MoEMedia"
import MoEAction from "./MoEAction"

export default class MoEInboxMessage {
  id?: number | undefined;
  campaignId: string;
  text: MoETextContent;
  isClicked: boolean;
  media?: MoEMedia | undefined;
  action?: Array<MoEAction> | undefined;
  tag?: string | undefined;
  receivedTime: string;
  expiry: string;
  payload: Map<String, Object>;
  groupKey: string | null;
  notificationId: string | null;
  sentTime: string | null;

  constructor(id: number | undefined, campaignId: string, textContent: MoETextContent, isClicked: boolean, media: MoEMedia | undefined, action: Array<MoEAction> | undefined, tag: string | undefined, receivedTime: string, expiry: string, payload: Map<String, Object>, groupKey: string | null, notificationId: string | null, sentTime: string | null) {
    this.id = id;
    this.campaignId = campaignId;
    this.text = textContent;
    this.isClicked = isClicked;
    this.media = media;
    this.action = action;
    this.tag = tag;
    this.receivedTime = receivedTime;
    this.expiry = expiry;
    this.payload = payload
    this.groupKey = groupKey;
    this.notificationId = notificationId;
    this.sentTime = sentTime;
  }
}
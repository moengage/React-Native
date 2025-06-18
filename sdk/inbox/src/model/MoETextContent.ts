export default class MoETextContent {
  title: string;
  message: string;
  summary?: string | undefined;
  // Only for iOS
  // subtitle is only for iOS
  subtitle?: string | undefined;
  constructor(title: string, message: string, summary: string | undefined, subtitle: string | undefined) {
    this.title = title;
    this.message = message;
    this.summary = summary;
    this.subtitle = subtitle;
  }
}
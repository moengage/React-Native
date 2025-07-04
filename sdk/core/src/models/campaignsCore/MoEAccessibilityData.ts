import { KEY_ACCESSIBILITY_HINT, KEY_ACCESSIBILITY_TEXT } from "../../utils/MoEConstants";

export default class MoEAccessibilityData {
  text: string | null;
  hint: string | null;

  constructor(text: string | null, hint: string | null) {
    this.text = text;
    this.hint = hint;
  }

  static fromJson(json: { [key: string]: any }): MoEAccessibilityData {
    return new MoEAccessibilityData(
      typeof json[KEY_ACCESSIBILITY_TEXT] === 'string' ? json[KEY_ACCESSIBILITY_TEXT] : null,
      typeof json[KEY_ACCESSIBILITY_HINT] === 'string' ? json[KEY_ACCESSIBILITY_HINT] : null
    );
  }

  toJson(): { [key: string]: any } {
    return {
      [KEY_ACCESSIBILITY_TEXT]: this.text,
      [KEY_ACCESSIBILITY_HINT]: this.hint,
    };
  }

  toString(): string {
    return `MoEAccessibilityData(text: ${this.text}, hint: ${this.hint})`;
  }
}
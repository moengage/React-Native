/// Helper class to track event attributes.
import MoEngageLogger from "../logger/MoEngageLogger";
import { MoEGeoLocationToJson } from "../utils/MoEObjectToJson";
import MoEGeoLocation from "./MoEGeoLocation";
import { MoESupportedAttributes } from "./MoESupportedAttributes";

export default class MoEProperties {
  private generalAttributes: { [k: string]: any }
  private locationAttributes: { [k: string]: any};
  private dateTimeAttributes: { [k: string]: any };
  private isNonInteractive: Boolean;

  constructor() {
    this.generalAttributes = new Object();
    this.locationAttributes = new Object();
    this.dateTimeAttributes = new Object();
    this.isNonInteractive = false;
  }

  getGeneralAttributes() {
    return this.generalAttributes;
  }

  getLocationAttributess() {
    return this.locationAttributes;
  }
  getDateTimeAttributes() {
    return this.dateTimeAttributes;
  }
  getIsNonInteractive() {
    return this.isNonInteractive;
  }

  /**
   * Call this method to add general attributes
   * @param {String}key : key for the attribute
   * @param {MoESupportedAttributes}value : value for the attribute
   */
  addAttribute(key: String, value: MoESupportedAttributes) {

    if (!this.validateKeyValue(key, value)) {
      return;
    }

    this.generalAttributes[key.toString()] = value;
  }

  /**
   * Call this method to add date attributes
   * @param {String}key : key for the attribute
   * @param {String}date : The value of the attribute, in ISO format [yyyy-MM-dd'T'HH:mm:ssZ] or [yyyy-MM-dd'T'HH:mm.sssZ].
   * eg. 2020-06-08T11:20:58.353Z OR 2020-06-10T12:42:10Z
   */
  addDateAttribute(key: String, date: String) {
    if (!this.validateKeyValue(key, date)) {
      return;
    }
    if (!this.validateType(["string"], date)) {
      MoEngageLogger.warn("MoEProperties->addDateAttribute:  invalid date attribute");
      return
    }
    this.dateTimeAttributes[key.toString()] = date;
  }

  /**
   * Call this method to add location attributes
   * @param {String}key : key for the attribute
   * @param {MoEGeoLocation}location : The value of the attribute, should be of type MOEGeoLocation.
   */
  addLocationAttribute(key: String, location: MoEGeoLocation) {
    if (
      !this.validateKeyValue(key, location) ||
      !(location instanceof MoEGeoLocation)
    ) {
      return;
    }
    if (this.validateLatLong(location)) {
      this.locationAttributes[key.toString()] = MoEGeoLocationToJson(location)
    } else {
      MoEngageLogger.warn("MoEGeoLocation->addLocationAttribute: invalid coordinates");
    }
  }

  /**
   * Call this method to marks an event as non-interactive.
   **/
  setNonInteractiveEvent() {
    this.isNonInteractive = true;
  }

  private validateKeyValue(key: String, value: any): Boolean {
    return !(key == null || key.length == 0 || value == null);
  }

  private validateType(arrTypes: Array<String>, value: any): Boolean {
    let type = typeof value;
    return arrTypes.includes(type);
  }

  private validateLatLong(location: MoEGeoLocation) {
    return (
      location.latitude.valueOf() > -91 &&
      location.latitude.valueOf() < 91 &&
      location.longitude.valueOf() > -181 &&
      location.longitude.valueOf() < 181
    );
  }
}

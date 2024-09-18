import { NativeEventEmitter, Platform } from "react-native";
import MoEProperties from "./models/MoEProperties";
import MoEGeoLocation from "./models/MoEGeoLocation";
import * as MoEHelper from "./utils/MoEHelper";

import { MoEAppStatus } from "./models/MoEAppStatus";
import MoEInAppCustomAction from "./models/MoEInAppCustomAction";
import MoEInAppNavigation from "./models/MoEInAppNavigation";
import { executeHandler } from "./utils/MoEEventHandlerHelper";
import {
  getAdIdTrackingJson,
  getAliasJson,
  getAndroidIdTrackingJson,
  getAppIdJson,
  getAppStatusJson,
  getInAppContextJson,
  getMoEPropertiesJson,
  getMoEPushCampaignJson,
  getMoEPushTokenJson,
  getOptOutTrackingJson,
  getSdkStateJson,
  getSelfHandledJson,
  getUserAttributeJson,
  getUserLocAttributeJson,
  getPushPermissionRequestCountJson,
  getDeviceIdTrackingJson,
  getInitConfigJson,
  getPermissionResponseJson,
  getNudgeDisplayJson
} from "./utils/MoEJsonBuilder";
import {
  USER_ATTRIBUTE_UNIQUE_ID,
  USER_ATTRIBUTE_USER_BDAY,
  USER_ATTRIBUTE_USER_EMAIL,
  USER_ATTRIBUTE_USER_FIRST_NAME,
  USER_ATTRIBUTE_USER_GENDER,
  USER_ATTRIBUTE_USER_LAST_NAME,
  USER_ATTRIBUTE_USER_LOCATION,
  USER_ATTRIBUTE_USER_MOBILE,
  USER_ATTRIBUTE_USER_NAME
} from "./utils/MoEConstants";
import MoESelfHandledCampaignData from "./models/MoESelfHandledCampaignData";
import { MoEngagePermissionType } from "./models/MoEngagePermissionType";
import MoEInitConfig from "./models/MoEInitConfig";
import MoEPushConfig from "./models/MoEPushConfig";
import MoEngageLogConfig from "./models/MoEngageLogConfig";
import MoEngageLogLevel from "./models/MoEngageLogLevel";
import MoEngageGlobalCache from "./utils/MoEngageGlobalCache";
import MoEngageLogger from "./logger/MoEngageLogger";
import UserDeletionData from "./models/UserDeletionData";
import MoEAccountMeta from "./models/MoEAccountMeta";

import MoEReactBridge from "./NativeMoEngage";
import MoEPushToken from "../src/models/MoEPushToken";
import MoEPushPayload from "../src/models/MoEPushPayload";
import MoEInAppData from "../src/models/MoEInAppData";
import { getUserDeletionData } from "../src/moeParser/MoEngagePayloadParser";
import { MoEngageNudgePosition } from "../src/models/MoEngageNudgePosition";
import MoEAnalyticsConfig from "../src/models/MoEAnalyticsConfig";
import { MoESupportedAttributes } from "./models/MoESupportedAttributes";
import * as MoECoreHandler from "./utils/MoECoreHandler";

const PLATFORM_IOS = "ios";
const PLATFORM_ANDROID = "android";
const GENERAL = "general";
const TIMESTAMP = 'timestamp';

const MOE_PUSH_CLICKED = "MoEPushClicked";
const MOE_PUSH_REGISTERED = "MoEPushTokenGenerated";
const MOE_INAPP_SHOWN = "MoEInAppCampaignShown";
const MOE_INAPP_CLICKED = "MoEInAppCampaignClicked";
const MOE_INAPP_DISMISSED = "MoEInAppCampaignDismissed";
const MOE_INAPP_CUSTOM_ACTION = "MoEInAppCampaignCustomAction";
const MOE_INAPP_SELF_HANDLE = "MoEInAppCampaignSelfHandled";
const MOE_PERMISSION_RESULT = "MoEPermissionResult";

const eventBroadcastNames = [
  MOE_PUSH_CLICKED,
  MOE_PUSH_REGISTERED,
  MOE_INAPP_SHOWN,
  MOE_INAPP_CLICKED,
  MOE_INAPP_DISMISSED,
  MOE_INAPP_CUSTOM_ACTION,
  MOE_INAPP_SELF_HANDLE,
  MOE_PERMISSION_RESULT
];

// JS Event Names
const PUSH_CLICKED = "pushClicked";
const PUSH_REGISTERED = "pushTokenGenerated"
const INAPP_SHOWN = "inAppCampaignShown";
const INAPP_CLICKED = "inAppCampaignClicked";
const INAPP_DISMISSED = "inAppCampaignDismissed";
const INAPP_CUTOM_ACTION = "inAppCampaignCustomAction";
const INAPP_SELF_HANDLE = "inAppCampaignSelfHandled";
export const PERMISSION_RESULT = "permissionResult";

const PUSH_SERVICE_FCM = "FCM"
const PUSH_SERVICE_PUSH_KIT = "PUSH_KIT"

const _eventNames = [
  PUSH_CLICKED,
  PUSH_REGISTERED,
  INAPP_SHOWN,
  INAPP_CLICKED,
  INAPP_DISMISSED,
  INAPP_CUTOM_ACTION,
  INAPP_SELF_HANDLE,
  PERMISSION_RESULT
];

var _eventTypeHandler = new Map();
var moeAppId = "";

const eventEmitter = new NativeEventEmitter(MoEReactBridge as any);

if (eventEmitter) {
  for (var i = 0; i < eventBroadcastNames.length; i++) {
    let eventName = _eventNames[i];
    let eventBroadcastName = eventBroadcastNames[i];
    if (eventName !== undefined && eventBroadcastName !== undefined) {
      handleEventBroadcast(eventName, eventBroadcastName);
    }
  }
}

function handleEventBroadcast(type: string | String, broadcast: string) {
  eventEmitter?.addListener(broadcast, (notification: any) => {
    executeHandler(_eventTypeHandler.get(type), notification, type);
  });
}

export type NotificationEventName = 'pushTokenGenerated' | 'pushClicked' | 'inAppCampaignShown' | 'inAppCampaignClicked' | 'inAppCampaignDismissed' | 'inAppCampaignCustomAction' | 'inAppCampaignSelfHandled';


type NotificationEventTypeMap = {
  "pushTokenGenerated": MoEPushToken,
  "pushClicked": MoEPushPayload,
  "inAppCampaignShown": MoEInAppData,
  "inAppCampaignClicked": MoEInAppData,
  "inAppCampaignDismissed": MoEInAppData,
  "inAppCampaignCustomAction": MoEInAppData,
  "inAppCampaignSelfHandled": MoESelfHandledCampaignData
}

var ReactMoE = {
  setEventListener: function <T extends NotificationEventName>(event: T, listener: (callback: NotificationEventTypeMap[T]) => void): void {
    _eventTypeHandler.set(event, listener);
  },

  removeEventListener: function (type: any) {
    if (!MoEReactBridge) return;
    _eventTypeHandler.delete(type);
  },

  /**
   * Initialise the MoEngage SDK, once the hybrid component is mounted
   *
   * @param appId AppId for the application, can be found on MoEngage Dashboard
   * @param initConfig instance of {@link MoEInitConfig}, works only in Android & has no effect for other plaforms.
   */
  initialize: function (appId: string, initConfig: MoEInitConfig = MoEInitConfig.defaultConfig()) {
    moeAppId = appId;
    MoEngageGlobalCache.updateInitConfig(initConfig);
    let payload: string = getInitConfigJson(appId, initConfig);
    MoEngageLogger.verbose("Initializing the MoEngage Plugin");
    MoEReactBridge.initialize(payload);
  },

  /**
   * Tells the SDK whether this is a migration or a fresh installation.
   * <b>Not calling this method will STOP execution of INSTALL CAMPAIGNS</b>.
   * This is solely required for migration to MoEngage Platform
   *
   * @param isExisting true if it is an existing user else set false
   */
  setAppStatus: function (status: MoEAppStatus) {
    MoEngageLogger.verbose("Will track whether it is a fresh install or update.");
    let payload = getAppStatusJson(MoEHelper.appStatusToString(status), moeAppId);
    MoEReactBridge.setAppStatus(payload);
  },

  /**
   * Tracks the specified event
   * @param eventName The action associated with the Event
   * @param {MoEProperties}properties : properties of the event
   */
  trackEvent: function (eventName: String, properties: MoEProperties) {
    if (properties == null) {
      properties = new MoEProperties()
    }

    if (!(properties instanceof MoEProperties)) {
      MoEngageLogger.warn("trackEvent: properties must of MoEProperties type");
      return;
    }

    MoEngageLogger.verbose("trackEvent with properties", properties);
    let payload = getMoEPropertiesJson(properties, eventName, moeAppId);
    MoEReactBridge.trackEvent(payload);
  },

  /**
   * Sets the unique id of the user. Should be set on user login.
   * @param uniqueId unique id to be set
   */
  setUserUniqueID: function (uniqueId: string) {
    MoEngageLogger.verbose("Will set unique ID: ", uniqueId);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_UNIQUE_ID, uniqueId, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Update user's unique id which was previously set by setUserUniqueID()
   * @param alias updated unique id.
   */
  setAlias: function (alias: string) {
    MoEngageLogger.verbose("Will set alias: ", alias);
    let payload = getAliasJson(alias, moeAppId);
    MoEReactBridge.setAlias(payload);
  },

  /**
   * Sets the user-name of the user.
   * @param userName user-name to be set
   */
  setUserName: function (userName: string) {
    MoEngageLogger.verbose("Will set username: ", userName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_NAME, userName, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the first name of the user.
   * @param firstName first name to be set
   */
  setUserFirstName: function (firstName: string) {
    MoEngageLogger.verbose("Will set first name: ", firstName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_FIRST_NAME, firstName, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the last name of the user.
   * @param lastName last name to be set
   */
  setUserLastName: function (lastName: string) {
    MoEngageLogger.verbose("Will set last name: ", lastName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_LAST_NAME, lastName, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the email-id of the user.
   * @param emailId email-id to be set
   */
  setUserEmailID: function (emailId: string) {
    MoEngageLogger.verbose("Will set email-id ", emailId);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_EMAIL, emailId, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the mobile number of the user.
   * @param mobileNumber mobile number to be set
   */
  setUserContactNumber: function (mobileNumber: string) {
    MoEngageLogger.verbose("Will set Mobile Number: ", mobileNumber);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_MOBILE, mobileNumber, GENERAL, moeAppId)
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the birthday of the user.
   * @param birthday birthday to be set in ISO format [yyyy-MM-dd'T'HH:mm:ss'Z'].
   */
  setUserBirthday: function (birthday: string) {
    MoEngageLogger.verbose("Will set birthday: ", birthday);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_BDAY, birthday, TIMESTAMP, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the gender of the user.
   * @param gender gender to be set
   */
  setUserGender: function (gender: string) {
    MoEngageLogger.verbose("Will set gender: ", gender);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_GENDER, gender, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the location of the user.
   * @param location coordinates of the user, which should be of type MoEUserLocation
   */
  setUserLocation: function (location: MoEGeoLocation) {
    if (!(location instanceof MoEGeoLocation)) {
      MoEngageLogger.warn("setUserLocation: location must of type MoEGeoLocation");
      return;
    }
    const payload = getUserLocAttributeJson(USER_ATTRIBUTE_USER_LOCATION, location.latitude, location.longitude, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the user attribute name.
   * @param userAttributeName attribute name
   * @param userAttributeValue attribute value
   */
  setUserAttribute: function (userAttributeName: string, userAttributeValue: MoESupportedAttributes) {
    MoEngageLogger.verbose(
      "Will track user attribute [attributeName]: " +
      userAttributeName +
      " attributeValue: " +
      userAttributeValue
    );
    const payload = getUserAttributeJson(userAttributeName, userAttributeValue, GENERAL, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Call this method to set date attribute of user.
   * @param {String}date : The value/attribute, in ISO format [yyyy-MM-dd'T'HH:mm:ss'Z'].
   * @param {String}key : The key, which is the kind of attribute
   */
  setUserAttributeISODateString: function (
    attributeName: String,
    date: String
  ) {
    const payload = getUserAttributeJson(attributeName, date, TIMESTAMP, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Sets the user attribute name.
   * @param userAttributeName attribute name
   * @param userAttributeValue attribute value
   */
  setUserAttributeLocation: function (
    userAttributeName: string,
    location: MoEGeoLocation
  ) {
    if (!(location instanceof MoEGeoLocation)) {
      MoEngageLogger.warn("setUserAttributeWithLocation: location must of type MoEGeoLocation");
      return;
    }
    const payload = getUserLocAttributeJson(userAttributeName, location.latitude, location.longitude, moeAppId);
    MoEReactBridge.setUserAttribute(payload);
  },

  /**
   * Notifys the SDK that the user has logged out of the app.
   */
  logout: function () {
    MoEngageLogger.verbose("Will logout user");
    MoEReactBridge.logout(getAppIdJson(moeAppId));
  },

  /**
   * Call this method wherever InApp message has to be shown, if available
   */
  showInApp: function () {
    MoEngageLogger.verbose("Will try to show in-app.");
    MoEReactBridge.showInApp(getAppIdJson(moeAppId));
  },

  /**
   * Call This method to show the nudge
   * @param position position at which nudge should be displayed.
   */
  showNudge: function (position: MoEngageNudgePosition = MoEngageNudgePosition.Any) {
    MoEngageLogger.verbose("Will try to show nudge");
    let payload = getNudgeDisplayJson(position, moeAppId);
    MoEReactBridge.showNudge(payload);
  },

  /**
   * Call this method to get the campaign info for self handled inApps
   */
  getSelfHandledInApp: function () {
    MoEngageLogger.verbose("Will try to fetch self handled inapp");
    MoEReactBridge.getSelfHandledInApp(getAppIdJson(moeAppId));
  },

  /**
   * Call this method when you show the self handled in-app so we can update impressions.
   * @param {MoESelfHandledCampaignData}inAppCampaign : campaign information object
   */
  selfHandledShown: function (inAppCampaign: MoESelfHandledCampaignData) {
    if (!(inAppCampaign instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledShown: inAppCampaign must of MoESelfHandledCampaignData type");
      return;
    }
    let campaignJson = getSelfHandledJson(inAppCampaign, "impression", moeAppId);
    MoEReactBridge.updateSelfHandledInAppStatus(campaignJson);
  },

  /**
   * Call this method to track when self handled in app widget(other than Primary Widget) is clicked.
   * @param {MoESelfHandledCampaignData}moEClickData : campaign information object
   */
  selfHandledClicked: function (moEClickData: MoESelfHandledCampaignData) {
    if (!(moEClickData instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledClicked: inAppCampaign must of MoEClickData type");
      return;
    }
    let campaignJson = getSelfHandledJson(moEClickData, "click", moeAppId);
    MoEReactBridge.updateSelfHandledInAppStatus(campaignJson);
  },

  /**
   * Call this method to track dismiss actions on the inApp.
   * @param {MoESelfHandledCampaignData}inAppCampaign : campaign information object
   */
  selfHandledDismissed: function (inAppCampaign: MoESelfHandledCampaignData) {
    if (!(inAppCampaign instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledDismissed: inAppCampaign must of MoESelfHandledCampaignData type");
      return;
    }
    let campaignJson = getSelfHandledJson(inAppCampaign, "dismissed", moeAppId);
    MoEReactBridge.updateSelfHandledInAppStatus(campaignJson);
  },

  /**
   * Call this method to the current context for inApp module.
   * @param{Array{String}}contexts : Name of all the contexts
   */
  setCurrentContext: function (contexts: Array<String>) {
    if (!MoEHelper.validateArrayOfString(contexts)) {
      MoEngageLogger.warn("setCurrentContext: contexts must be a non empty array of strings");
      return;
    }
    let payload = getInAppContextJson(contexts, moeAppId);
    MoEReactBridge.setAppContext(payload);
  },

  /**
   * Call this method to the reset current context for inApp module.
   */
  resetCurrentContext: function () {
    MoEReactBridge.resetAppContext(getAppIdJson(moeAppId));
  },

  /**
   * Pass the FCM push token to the MoEngage SDK.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {String} pushToken
   */
  passFcmPushToken: function (pushToken: string) {
    MoEngageLogger.verbose("Will process push token");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getMoEPushTokenJson(pushToken, PUSH_SERVICE_FCM, PLATFORM_ANDROID, moeAppId);
      MoEReactBridge.passFcmPushToken(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },
  /**
   * Pass push payload to the MoEngage SDK.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {JSONObject} pushPayload
   */
  passFcmPushPayload: function (pushPayload: object) {
    MoEngageLogger.verbose("Will process push payload.");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getMoEPushCampaignJson(pushPayload, PUSH_SERVICE_FCM, moeAppId);
      MoEReactBridge.passFcmPushPayload(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * Call this method to register for push notification in iOS
   * Note: This API is only for iOS platform and is a no-operation method for other plaforms.
   */
  registerForPush: function () {
    if (Platform.OS == PLATFORM_IOS) {
      MoEngageLogger.verbose("Will registerForPush");
      MoEReactBridge.registerForPush();
    } else {
      MoEngageLogger.debug("This api is not supported on Android platform.");
    }
  },

  /**
   * Call this method to enable the data tracking
   *
   * Note: By default data tracking is enabled.
   *
   * @since 10.0.0
   */
  enableDataTracking: function () {
    MoEngageLogger.verbose("Will opt in data tracking");
    let payload = getOptOutTrackingJson("data", false, moeAppId);
    MoEReactBridge.optOutDataTracking(payload);
  },

  /**
   * Call this method to disable the data tracking
   * Note: When data tracking is opted out no custom event or user attribute is tracked on MoEngage Platform.
   *
   * @since 10.0.0
   */
  disableDataTracking: function () {
    MoEngageLogger.verbose("Will opt out data tracking");
    let payload = getOptOutTrackingJson("data", true, moeAppId);
    MoEReactBridge.optOutDataTracking(payload);
  },

  /**
   * Pass the HMS PushKit push token to the MoEngage SDK.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {String} pushToken
   */
  passPushKitPushToken: function (pushToken: string) {
    MoEngageLogger.verbose("Will process push-kit push token");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getMoEPushTokenJson(pushToken, PUSH_SERVICE_PUSH_KIT, PLATFORM_ANDROID, moeAppId);
      MoEReactBridge.passPushKitPushToken(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to enable all features of the SDK for the account configured as default.
   * Note: All the feature is enabled by default.
   */
  enableSdk: function () {
    MoEngageLogger.verbose("Will enable SDK");
    let payload = getSdkStateJson(true, moeAppId);
    MoEReactBridge.updateSdkState(payload);
  },

  /**
   * API to disable all features of the SDK for the account configured as default.
   */
  disableSdk: function () {
    MoEngageLogger.verbose("Will disable SDK");
    let payload = getSdkStateJson(false, moeAppId);
    MoEReactBridge.updateSdkState(payload);
  },

  /**
   * Notify the MoEngage SDK about the device orientation change
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  onOrientationChanged: function () {
    MoEngageLogger.verbose("Will process screen rotation.");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEReactBridge.onOrientationChanged();
    }
  },

  /**
   * API to enable Advertising Id tracking for Android.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  enableAdIdTracking: function () {
    MoEngageLogger.verbose("Will enable advertising-id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getAdIdTrackingJson(true, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to disable Advertising Id tracking for Android.
   *
   * By default Advertising Id tracking is disabled, call this method only if you have enabled
   * Advertising Id tracking at some point.
   *
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  disableAdIdTracking: function () {
    MoEngageLogger.verbose("Will disable advertising-id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getAdIdTrackingJson(false, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to enable Android Id tracking for Android.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  enableAndroidIdTracking: function () {
    MoEngageLogger.verbose("Will enable android-id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getAndroidIdTrackingJson(true, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to disable Android Id tracking for Android.
   *
   * By default Android Id tracking is disabled, call this method only if you have enabled
   * Advertising Id tracking at some point.
   *
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  disableAndroidIdTracking: function () {
    MoEngageLogger.verbose("Will disable android-id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getAndroidIdTrackingJson(false, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  pushPermissionResponseAndroid: function (isGranted: boolean) {
    MoEngageLogger.verbose("Will track permission response");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getPermissionResponseJson(isGranted, MoEngagePermissionType.PUSH)
      MoEReactBridge.pushPermissionResponseAndroid(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  setupNotificationChannelsAndroid: function () {
    MoEngageLogger.verbose("Will setup notification");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEReactBridge.setupNotificationChannels();
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  navigateToSettingsAndroid: function () {
    MoEngageLogger.verbose("Will navigate to settings");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEReactBridge.navigateToSettingsAndroid();
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  requestPushPermissionAndroid: function () {
    MoEngageLogger.verbose("Will request push permission.");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEReactBridge.requestPushPermissionAndroid();
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to update push permission request count. The count will be incremented on every call.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {number} count - number of times push permission requested
   */
  updatePushPermissionRequestCountAndroid: function (count: number) {
    MoEngageLogger.verbose("Will increment push permission request count");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getPushPermissionRequestCountJson(count, moeAppId);
      MoEReactBridge.updatePushPermissionRequestCountAndroid(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to enable Device Id tracking for Android.
   *
   * Note: By default Device Id tracking is enabled.This API is only for Android platform and is a no-operation method for other plaforms.
   */
  enableDeviceIdTracking: function () {
    MoEngageLogger.verbose("Will enable device id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getDeviceIdTrackingJson(true, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * API to disable Device Id tracking for Android.
   *
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   */
  disableDeviceIdTracking: function () {
    MoEngageLogger.verbose("Will disable device id tracking");
    if (Platform.OS == PLATFORM_ANDROID) {
      let payload = getDeviceIdTrackingJson(false, moeAppId);
      MoEReactBridge.deviceIdentifierTrackingStatusUpdate(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * Delete User Data From MoEngage Server
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   * 
   * @return instance of {@link UserDeletionData}
   * @since 8.6.0
   */
  deleteUser: async function (): Promise<UserDeletionData> {
    MoEngageLogger.verbose("Will delete user");
    const accountMetaJson = getAppIdJson(moeAppId);
    try {
      if (Platform.OS == PLATFORM_ANDROID) {
        const deleteUserPayload = await MoEReactBridge.deleteUser(accountMetaJson);
        return getUserDeletionData(deleteUserPayload as string);
      } else {
        MoEngageLogger.debug("This api is not supported on iOS platform.");
      }
    } catch (error) {
      MoEngageLogger.error(`deleteUser(): ${error}`)
    }

    return new UserDeletionData(new MoEAccountMeta(moeAppId), false)
  },

  /**
  * Call this method to get the multiple self handled campaigns.
  * @since TODO
  */
  getSelfHandledInApps: async function () {
    MoEngageLogger.verbose("Will try to fetch multiple self handled inapps", moeAppId);
    return await MoECoreHandler.getSelfHandledInApps(moeAppId);
  },

  /**
   * Call this method to register for provisional push notification in iOS
   * Note: This API is only for iOS platform and is a no-operation method for other plaforms.
   * @since TODO
   */
  registerForProvisionalPush: function () {
    if (Platform.OS == PLATFORM_IOS) {
      MoEngageLogger.verbose("Will call registerForProvisionalPush");
      MoEReactBridge.registerForProvisionalPush();
    } else {
      MoEngageLogger.debug("This api is not supported on Android platform.");
    }
  },
};

export {
  MoEInAppCustomAction,
  MoEInAppNavigation,
  MoESelfHandledCampaignData,
  MoEGeoLocation,
  MoEProperties,
  MoEAppStatus,
  MoEInitConfig,
  MoEPushConfig,
  MoEngageLogConfig,
  MoEngageLogLevel,
  MoEngageLogger,
  MoEngageNudgePosition,
  MoEAnalyticsConfig
};
export default ReactMoE;


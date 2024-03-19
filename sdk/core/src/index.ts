import {NativeEventEmitter, Platform} from "react-native";
import MoEProperties from "./models/MoEProperties";
import MoEGeoLocation from "./models/MoEGeoLocation";
import * as MoEHelper from "./utils/MoEHelper";

import {MoEAppStatus} from "./models/MoEAppStatus";
import {MoERNAndroid} from "./platform/MoERNAndroid";
import {MoERNiOS} from "./platform/MoERNiOS";

import MoEInAppCustomAction from "./models/MoEInAppCustomAction";
import MoEInAppNavigation from "./models/MoEInAppNavigation";
import {executeHandler} from "./utils/MoEEventHandlerHelper";

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
import {MoEngagePermissionType} from "./models/MoEngagePermissionType";
import MoEInitConfig from "./models/MoEInitConfig";
import MoEPushConfig from "./models/MoEPushConfig";
import MoEngageLogConfig from "./models/MoEngageLogConfig";
import MoEngageLogLevel from "./models/MoEngageLogLevel";
import MoEngageGlobalCache from "./utils/MoEngageGlobalCache";
import MoEngageLogger from "./logger/MoEngageLogger";
import UserDeletionData from "./models/UserDeletionData";
import MoEAccountMeta from "./models/MoEAccountMeta";
import { MoEngageNudgePosition } from "./models/MoEngageNudgePosition";

const MoEReactBridge = require("react-native").NativeModules.MoEReactBridge;
const PLATFORM_ANDROID = "android";
const PLATFORM_IOS = "ios";
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
var MoeEventEmitter: { addListener: (arg0: any, arg1: (notification: any) => void) => void; };
var moeAppId = "";

if (MoEReactBridge) {
  MoeEventEmitter = new NativeEventEmitter(MoEReactBridge);
  for (var i = 0; i < eventBroadcastNames.length; i++) {
    let eventName = _eventNames[i];
    let eventBroadcastName = eventBroadcastNames[i];
    if (eventName !== undefined && eventBroadcastName !== undefined) {
      handleEventBroadcast(eventName, eventBroadcastName);
    }
  }
}

function handleEventBroadcast(type: string | String, broadcast: string) {
  MoeEventEmitter.addListener(broadcast, (notification: any) => {
    executeHandler(_eventTypeHandler.get(type), notification, type);
  });
}

function commonValidationCheck() {
  if (Platform.OS == PLATFORM_ANDROID) {
    MoERNAndroid.validateSDKVersion()
  } else if (Platform.OS == PLATFORM_IOS) {
    MoERNiOS.validateSDKVersion();
  }
}

var ReactMoE = {
  setEventListener: function (type: any, handler: any) {
    if (!MoEReactBridge) return;
    _eventTypeHandler.set(type, handler);
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
    commonValidationCheck();
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.initialize(getInitConfigJson(appId, initConfig));
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.initialize(getAppIdJson(appId));
    }
  },

  /**
   * Tells the SDK whether this is a migration or a fresh installation.
   * <b>Not calling this method will STOP execution of INSTALL CAMPAIGNS</b>.
   * This is solely required for migration to MoEngage Platform
   *
   * @param isExisting true if it is an existing user else set false
   */
  setAppStatus: function (status: MoEAppStatus) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will track whether it is a fresh install or update.");
    let payload = getAppStatusJson(MoEHelper.appStatusToString(status), moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setAppStatus(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setAppStatus(payload);
    }
  },

  /**
   * Tracks the specified event
   * @param eventName The action associated with the Event
   * @param {MoEProperties}properties : properties of the event
   */
  trackEvent: function (eventName: String, properties: MoEProperties) {
    commonValidationCheck();

    if (properties == null) {
      properties = new MoEProperties()
    }

    if (!(properties instanceof MoEProperties)) {
      MoEngageLogger.warn("trackEvent: properties must of MoEProperties type");
      return;
    }

    MoEngageLogger.verbose("trackEvent with properties", properties);
    let payload = getMoEPropertiesJson(properties, eventName, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.trackEvent(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.trackEvent(payload);
    }
  },

  /**
   * Sets the unique id of the user. Should be set on user login.
   * @param uniqueId unique id to be set
   */
  setUserUniqueID: function (uniqueId: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set unique ID: ", uniqueId);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_UNIQUE_ID, uniqueId, GENERAL, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Update user's unique id which was previously set by setUserUniqueID()
   * @param alias updated unique id.
   */
  setAlias: function (alias: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set alias: ", alias);
    let payload = getAliasJson(alias, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setAlias(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setAlias(payload);
    }
  },

  /**
   * Sets the user-name of the user.
   * @param userName user-name to be set
   */
  setUserName: function (userName: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set username: ", userName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_NAME, userName, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the first name of the user.
   * @param firstName first name to be set
   */
  setUserFirstName: function (firstName: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set first name: ", firstName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_FIRST_NAME, firstName, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the last name of the user.
   * @param lastName last name to be set
   */
  setUserLastName: function (lastName: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set last name: ", lastName);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_LAST_NAME, lastName, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the email-id of the user.
   * @param emailId email-id to be set
   */
  setUserEmailID: function (emailId: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set email-id ", emailId);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_EMAIL, emailId, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the mobile number of the user.
   * @param mobileNumber mobile number to be set
   */
  setUserContactNumber: function (mobileNumber: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set Mobile Number: ", mobileNumber);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_MOBILE, mobileNumber, GENERAL, moeAppId)
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the birthday of the user.
   * @param birthday birthday to be set in ISO format [yyyy-MM-dd'T'HH:mm:ss'Z'].
   */
  setUserBirthday: function (birthday: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set birthday: ", birthday);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_BDAY, birthday, TIMESTAMP, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the gender of the user.
   * @param gender gender to be set
   */
  setUserGender: function (gender: Object) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will set gender: ", gender);
    const payload = getUserAttributeJson(USER_ATTRIBUTE_USER_GENDER, gender, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the location of the user.
   * @param location coordinates of the user, which should be of type MoEUserLocation
   */
  setUserLocation: function (location: MoEGeoLocation) {
    commonValidationCheck();
    if (!(location instanceof MoEGeoLocation)) {
      MoEngageLogger.warn("setUserLocation: location must of type MoEGeoLocation");
      return;
    }
    const payload = getUserLocAttributeJson(USER_ATTRIBUTE_USER_LOCATION, location.latitude, location.longitude, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Sets the user attribute name.
   * @param userAttributeName attribute name
   * @param userAttributeValue attribute value
   */
  setUserAttribute: function (userAttributeName: string, userAttributeValue: String | Number | Boolean | Array<String> | Array<Number>) {
    commonValidationCheck();
    MoEngageLogger.verbose(
      "Will track user attribute [attributeName]: " +
      userAttributeName +
      " attributeValue: " +
      userAttributeValue
    );
    const payload = getUserAttributeJson(userAttributeName, userAttributeValue, GENERAL, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
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
    commonValidationCheck();
    const payload = getUserAttributeJson(attributeName, date, TIMESTAMP, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
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
    commonValidationCheck();
    if (!(location instanceof MoEGeoLocation)) {
      MoEngageLogger.warn("setUserAttributeWithLocation: location must of type MoEGeoLocation");
      return;
    }
    const payload = getUserLocAttributeJson(userAttributeName, location.latitude, location.longitude, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setUserAttribute(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setUserAttribute(payload);
    }
  },

  /**
   * Notifys the SDK that the user has logged out of the app.
   */
  logout: function () {
    commonValidationCheck();
    MoEngageLogger.verbose("Will logout user");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.logout(getAppIdJson(moeAppId));
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.logout(getAppIdJson(moeAppId));
    }
  },

  /**
   * Call this method wherever InApp message has to be shown, if available
   */
  showInApp: function () {
    commonValidationCheck();
    MoEngageLogger.verbose("Will try to show in-app.");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.showInApp(getAppIdJson(moeAppId));
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.showInApp(getAppIdJson(moeAppId));
    }
  },

  /**
   * Call this method to get the campaign info for self handled inApps
   */
  getSelfHandledInApp: function () {
    commonValidationCheck();
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.getSelfHandledInApp(getAppIdJson(moeAppId));
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.getSelfHandledInApp(getAppIdJson(moeAppId));
    }
  },

  /**
   * Call This method to show the nudge
   * @param position position at which nudge should be displayed.
   */
  showNudge: function(position: MoEngageNudgePosition = MoEngageNudgePosition.Any){
    commonValidationCheck();
    let jsonPayload =  getNudgeDisplayJson(position, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.showNudge(jsonPayload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.showNudge(jsonPayload);
    }
  },

  /**
   * Call this method when you show the self handled in-app so we can update impressions.
   * @param {MoESelfHandledCampaignData}campInfo : campaign information object
   */
  selfHandledShown: function (inAppCampaign: MoESelfHandledCampaignData) {
    commonValidationCheck();
    if (!(inAppCampaign instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledShown: inAppCampaign must of MoESelfHandledCampaignData type");
      return;
    }
    let campaignJson = getSelfHandledJson(inAppCampaign, "impression", moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.selfHandledShown(campaignJson);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.selfHandledShown(campaignJson);
    }
  },

  /**
   * Call this method to track when self handled in app widget(other than Primary Widget) is clicked.
   * @param {MoESelfHandledCampaignData}campInfo : campaign information object
   */
  selfHandledClicked: function (moEClickData: MoESelfHandledCampaignData) {
    commonValidationCheck();
    if (!(moEClickData instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledClicked: inAppCampaign must of MoEClickData type");
      return;
    }
    let campaignJson = getSelfHandledJson(moEClickData, "click", moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.selfHandledClicked(campaignJson);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.selfHandledClicked(campaignJson);
    }
  },

  /**
   * Call this method to track dismiss actions on the inApp.
   * @param {MoESelfHandledCampaignData}campInfo : campaign information object
   */
  selfHandledDismissed: function (inAppCampaign: MoESelfHandledCampaignData) {
    commonValidationCheck();
    if (!(inAppCampaign instanceof MoESelfHandledCampaignData)) {
      MoEngageLogger.warn("selfHandledDismissed: inAppCampaign must of MoESelfHandledCampaignData type");
      return;
    }
    let campaignJson = getSelfHandledJson(inAppCampaign, "dismissed", moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.selfHandledDismissed(campaignJson);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.selfHandledDismissed(campaignJson);
    }
  },

  /**
   * Call this method to the current context for inApp module.
   * @param {Array{String}}contexts : Name of all the contexts
   */
  setCurrentContext: function (contexts: Array<String>) {
    commonValidationCheck();
    if (!MoEHelper.validateArrayOfString(contexts)) {
      MoEngageLogger.warn("setCurrentContext: contexts must be a non empty array of strings");
      return;
    }
    let payload = getInAppContextJson(contexts, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setAppContext(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.setAppContext(payload);
    }
  },

  /**
   * Call this method to the reset current context for inApp module.
   */
  resetCurrentContext: function () {
    commonValidationCheck();
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.resetAppContext(getAppIdJson(moeAppId));
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.resetAppContext(getAppIdJson(moeAppId));
    }
  },

  /**
   * Pass the FCM push token to the MoEngage SDK.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {String} pushToken
   */
  passFcmPushToken: function (pushToken: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will process push token");
    let payload = getMoEPushTokenJson(pushToken, PUSH_SERVICE_FCM, PLATFORM_ANDROID, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.passFcmPushToken(payload);
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
    commonValidationCheck();
    MoEngageLogger.verbose("Will process push payload.");
    let payload = getMoEPushCampaignJson(pushPayload, PUSH_SERVICE_FCM, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.passFcmPushPayload(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  /**
   * Call this method to register for push notification in iOS
   */
  registerForPush: function () {
    commonValidationCheck();
    MoEngageLogger.verbose("Will registerForPush");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEngageLogger.debug("This api is not supported on android platform.");
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.registerForPush();
    }
  },

  /**
   * Call this method to disable Inbox/ Notification Center feature.
   */
  disableInbox: function () {
    commonValidationCheck();
    MoEngageLogger.verbose("Will disableInbox");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoEngageLogger.debug("This api is not supported on android platform.");
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.disableInbox(getAppIdJson(moeAppId));
    }
  },

  /**
   * Call this method to start Geofence tracking, this method also asks for location permission if not already done
   */
  startGeofenceMonitoring() {
    if (Platform.OS == PLATFORM_ANDROID) {
      //Android code
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.startGeofenceMonitoring(getAppIdJson(moeAppId));
    }
  },

  optOutDataTracking: function (shouldOptOutDataTracking: boolean) {
    MoEngageLogger.verbose("Will opt out data tracking");
    let payload = getOptOutTrackingJson("data", shouldOptOutDataTracking, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.optOutDataTracking(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.optOutDataTracking(payload);
    }
  },

  /**
   * Pass the HMS PushKit push token to the MoEngage SDK.
   * Note: This API is only for Android platform and is a no-operation method for other plaforms.
   *
   * @param {String} pushToken
   */
  passPushKitPushToken: function (pushToken: string) {
    commonValidationCheck();
    MoEngageLogger.verbose("Will process push-kit push token");
    let payload = getMoEPushTokenJson(pushToken, PUSH_SERVICE_PUSH_KIT, PLATFORM_ANDROID, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.passPushKitPushToken(payload);
    } else {
      MoEngageLogger.debug("This api is not supported on iOS platform.");
    }
  },

  enableSdk: function () {
    MoEngageLogger.verbose("Will enable SDK");
    let payload = getSdkStateJson(true, moeAppId);
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.updateSdkState(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.updateSdkState(payload);
    }
  },

  disableSdk: function () {
    MoEngageLogger.verbose("Will disable SDK");
    let payload = getSdkStateJson(false, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.updateSdkState(payload);
    } else if (Platform.OS == PLATFORM_IOS) {
      MoERNiOS.updateSdkState(payload);
    }
  },

  onOrientationChanged: function () {
    MoEngageLogger.verbose("Will process screen rotation.");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.onOrientationChanged();
    }
  },

  /**
   * API to enable Advertising Id tracking for Android.
   */
  enableAdIdTracking: function () {
    MoEngageLogger.verbose("Will enable advertising-id tracking");
    let payload = getAdIdTrackingJson(true, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.enableAdIdTracking(payload);
    }
  },

  /**
   * API to disable Advertising Id tracking for Android.
   *
   * By default Advertising Id tracking is disabled, call this method only if you have enabled
   * Advertising Id tracking at some point.
   */
  disableAdIdTracking: function () {
    MoEngageLogger.verbose("Will disable advertising-id tracking");
    let payload = getAdIdTrackingJson(false, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.disableAdIdTracking(payload);
    }
  },

  /**
   * API to enable Android Id tracking for Android.
   */
  enableAndroidIdTracking: function () {
    MoEngageLogger.verbose("Will enable android-id tracking");
    let payload = getAndroidIdTrackingJson(true, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.enableAndroidIdTracking(payload);
    }
  },

  /**
   * API to disable Android Id tracking for Android.
   *
   * By default Android Id tracking is disabled, call this method only if you have enabled
   * Advertising Id tracking at some point.
   */
  disableAndroidIdTracking: function () {
    MoEngageLogger.verbose("Will disable android-id tracking");
    let payload = getAndroidIdTrackingJson(false, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.disableAndroidIdTracking(payload);
    }
  },

  pushPermissionResponseAndroid: function (isGranted: boolean) {
    MoEngageLogger.verbose("Will track permission response");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.permissionResponse(isGranted, MoEngagePermissionType.PUSH)
    }
  },

  setupNotificationChannelsAndroid: function () {
    MoEngageLogger.verbose("Will setup notification");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.setupNotificationChannels();
    }
  },

  navigateToSettingsAndroid: function () {
    MoEngageLogger.verbose("Will navigate to settings");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.navigateToSettings();
    }
  },

  requestPushPermissionAndroid: function () {
    MoEngageLogger.verbose("Will request push permission.");
    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.requestPushPermission();
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
    let payload = getPushPermissionRequestCountJson(count, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.updatePushPermissionRequestCount(payload);
    }
  },

  /**
   * API to enable Device Id tracking for Android.
   *
   * Note: By default Device Id tracking is enabled
   */
  enableDeviceIdTracking: function () {
    MoEngageLogger.verbose("Will enable device id tracking");
    let payload = getDeviceIdTrackingJson(true, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.enableDeviceIdTracking(payload);
    }
  },

  /**
   * API to disable Device Id tracking for Android.
   */
  disableDeviceIdTracking: function () {
    MoEngageLogger.verbose("Will disable device id tracking");
    let payload = getDeviceIdTrackingJson(false, moeAppId);

    if (Platform.OS == PLATFORM_ANDROID) {
      MoERNAndroid.disableDeviceIdTracking(payload);
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
        return await MoERNAndroid.deleteUser(accountMetaJson);
      }
    } catch(error) {
      MoEngageLogger.error(`deleteUser(): ${error}`)
    }

    return new UserDeletionData(new MoEAccountMeta(moeAppId), false)
  }
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
};
export default ReactMoE;

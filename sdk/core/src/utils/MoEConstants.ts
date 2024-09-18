import MoEngageLogLevel from "../models/MoEngageLogLevel"

export const MOE_PLATFORM = 'platform'
export const MOE_PAYLOAD = 'payload'
export const MOE_DATA = 'data'
export const ACCOUNT_META = 'accountMeta'
export const APP_ID = 'appId'

//LOCATION ATTRIBUTE
export const MOE_LOCATION = 'location'

//INAPP CAMPAIGN 
export const MOE_CAMPAIGN_ID = 'campaignId'
export const MOE_CAMPAIGN_NAME = 'campaignName'
export const MOE_CAMPAIGN_CONTEXT = 'campaignContext'
export const MOE_CUSTOM_ACTION = 'customAction'
export const MOE_SELF_HANDLED = 'selfHandled'
export const MOE_NAVIGATION = 'navigation'
export const MOE_WIDGET_ID = 'widgetId'
export const FORMATTED_CAMPAIGN_ID = 'cid'
export const ATTRIBUTES = 'attributes'

//IN APP CUSTOM ACTION 
export const MOE_KEY_VALUE_PAIR = 'kvPair'

//IN APP SELF HANDLED 
export const MOE_DISMISSINTERVAL = 'dismissInterval'
export const MOE_IS_CANCELLABLE = 'isCancellable'
export const MOE_CAMPAIGNS = 'campaigns'

// INAPP DISPLAY RULES
export const MOE_INAPP_DISPLAY_RULES = 'displayRules'
export const MOE_INAPP_SCREEN_NAME = 'screenName'
export const MOE_INAPP_CONTEXTS = 'contexts'

//IN APP NAVIGATION
export const MOE_NAVIGATION_TYPE = 'navigationType'
export const ACTION_TYPE = 'actionType'
export const MOE_NAVIGATION_VALUE = 'value'

//PUSH TOKEN
export const MOE_PUSH_SERVICE = 'pushService'
export const MOE_TOKEN = 'token'

//PUSH CAMPAIGN
export const MOE_CLICKED_ACTION = 'clickedAction'
export const MOE_IS_DEFAULT_ACTION = 'isDefaultAction'

//INVALID OBJECT ERROR MESSAGES
export const MOE_IN_APP_OBJECT_ERROR = 'MoEInAppCampaign is an invalid object'
export const MOE_CUSTOM_ACTION_OBJ_ERROR = 'MoEInAppCustomAction is an invalid object'
export const MOE_SELF_HANDLED_OBJ_ERROR = 'MoEInAppSelfHandledCampaign is an invalid object'
export const MOE_NAVIGATION_OBJ_ERROR = 'MoEInAppNavigation is an invalid object'
export const MOE_PUSH_CAMPAIGN_OBJ_ERROR = 'MoEPushCampaign is an invalid object'
export const MOE_PUSH_TOKEN_OBJ_ERROR = 'MoEPushToken is an invalid object'
//USER ATTRIBUTES
export const USER_ATTRIBUTE_UNIQUE_ID = 'USER_ATTRIBUTE_UNIQUE_ID';
export const USER_ATTRIBUTE_USER_NAME = 'USER_ATTRIBUTE_USER_NAME';
export const USER_ATTRIBUTE_USER_FIRST_NAME = 'USER_ATTRIBUTE_USER_FIRST_NAME';
export const USER_ATTRIBUTE_USER_LAST_NAME = 'USER_ATTRIBUTE_USER_LAST_NAME';
export const USER_ATTRIBUTE_USER_EMAIL = 'USER_ATTRIBUTE_USER_EMAIL';
export const USER_ATTRIBUTE_USER_MOBILE = 'USER_ATTRIBUTE_USER_MOBILE';
export const USER_ATTRIBUTE_USER_BDAY = 'USER_ATTRIBUTE_USER_BDAY';
export const USER_ATTRIBUTE_USER_GENDER = 'USER_ATTRIBUTE_USER_GENDER';
export const USER_ATTRIBUTE_USER_LOCATION = 'USER_ATTRIBUTE_USER_LOCATION';

export const MOE_PERMISSION_TYPE = "type";
export const MOE_PERMISSION_STATE = "isGranted";

// INIT CONFIG
export const KEY_MOE_CONFIG = "config";
export const KEY_PUSH_CONFIG = "pushConfig";

// PUSH CLICK KEY
export const SELF_HANDLED_PUSH_REDIRECTION_KEY = "selfHandledPushRedirection";

// Default Log Level For MoEngage React Plugin
export const DEFAULT_CONFIG_LOG_LEVEL = MoEngageLogLevel.INFO;

// Default Logging For Production Build
export const DEFAULT_CONFIG_RELEASE_BUILD_LOG_ENABLED = false;

// Key to get the user deletion state while deleting user from native bridge
export const IS_USER_DELETION_SUCCESS = "isUserDeletionSuccess";
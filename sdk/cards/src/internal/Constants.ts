/**
 * @file All the string constant used to build the payload & object
 * @author Abhishek Kumar
 * @since 1.0.0
 */

export const MODULE_TAG = "MoEngageReactCards_"

export const keyPayload = "payload";

//Card Key Name Constants
export const keyAppId = "appId";
export const keyAccountMeta = "accountMeta";
export const keyData = "data";
export const keySyncCompleteData = "syncCompleteData";
export const keyHasUpdates = "hasUpdates";
export const keySyncType = "syncType";
export const keyId = "id";
export const keyCardId = "card_id";
export const keyCategory = "category";
export const keyTemplateData = "template_data";
export const keyMetaData = "meta_data";
export const keyAdditionalMetaData = "metaData";
export const keyTemplateType = "type";
export const keyKVPairs = "kvPairs";

//Template Constants
export const keyContainers = "containers";
export const keyContainerId = "id";
export const keyContainerType = "type";
export const keyContainerStyle = "style";
export const keyBackgroundColor = "bgColor";
export const keyActions = "actions";
export const keyWidgets = "widgets";
export const keyWidgetId = "id";
export const keyWidgetType = "type";
export const keyWidgetContent = "content";
export const keyWidgetStyle = "style";
export const keyFontSize = "fontSize";
export const keyActionType = "name";
export const keyActionValue = "value";
export const keyNavigationType = "type";

//Default Values
export const defaultFontSize = -1;
export const defaultTextBgColor = "#00FFFFFF";
export const defaultContainerBgColor = "#FFFFFF";

//CampaignState
export const keyLocalShowCount = "localShowCount";
export const keyTotalShowCount = "totalShowCount";
export const keyIsClicked = "isClicked";
export const keyFirstSeen = "firstSeen";
export const keyFirstReceived = "firstReceived";
export const keyIsNewCard = "isNewCard";
export const keyCampaignPayload = "campaignPayload";
export const keyCampaignState = "campaignState";
export const keyDeletionTime = "deletionTime";
export const keyUpdatedAt = "updated_at";
export const keyCreatedAt = "created_at";

//Display Control Constants
export const keyExpireAt = "expire_at";
export const keyExpireAfterSeen = "expire_after_seen";
export const keyExpireAfterDelivered = "expire_after_delivered";
export const keyMaxCount = "max_times_to_show";
export const keyShowTime = "show_time";
export const keyIsPinned = "is_pin";
export const keyStartTime = "start_time";
export const keyEndTime = "end_time";

//Card Data export constants
export const keyDisplayControl = "display_controls";
export const keyShouldShowAllTab = "shouldShowAllTab";
export const keyCategories = "categories";
export const keyCards = "cards";
export const keyCard = "card";
export const keyWidgetIdentifier = "widgetId";
export const keyIsAllCategoryEnabled = "isAllCategoryEnabled";
export const keyNewCardsCount = "newCardsCount";
export const keyUnClickedCardsCount = "unClickedCardsCount";

//JSON Values export constants
export const argumentPullToRefreshSync = "onPullToRefreshCardsSync";
export const argumentInboxOpenSync = "onInboxOpenCardsSync";
export const argumentGenericSync = "onCardsSync";
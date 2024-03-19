//
//  MoEngageReactConstants.m
//  ReactNativeMoEngage
//
//  Created by Rakshitha C D on 10/02/21.
//  Copyright © 2020 MoEngage. All rights reserved.
//

#import "MoEngageReactConstants.h"

NSString* const kReactNative                              = @"react_native";

// Info.plist Keys
NSString* const kMoEngage                                 = @"MoEngage";
NSString* const kAppId                                    = @"MoEngage_APP_ID";
NSString* const kDataCenter                               = @"DATA_CENTER";
NSString* const kAppGroupId                               = @"APP_GROUP_ID";
NSString* const kDisablePeriodicFlush                     = @"DISABLE_PERIODIC_FLUSH";
NSString* const kPeriodicFlushDuration                    = @"PERIODIC_FLUSH_DURATION";
NSString* const kEncryptNetworkRequests                   = @"ENCRYPT_NETWORK_REQUESTS";
NSString* const kEnableLogs                               = @"ENABLE_LOGS";

//DataCenter Constants
NSString* const kDataCenter1                              = @"DATA_CENTER_01";
NSString* const kDataCenter2                              = @"DATA_CENTER_02";
NSString* const kDataCenter3                              = @"DATA_CENTER_03";
NSString* const kDataCenter4                              = @"DATA_CENTER_04";
NSString* const kDataCenter5                              = @"DATA_CENTER_05";


//PayLoad Constants
NSString* const kPayload                                  = @"payload";
NSString* const kEventName                                = @"event_name";
NSString* const kPayloadDict                              = @"payload_dict";
NSString* const kEventEmitted                             = @"event-emitted";

NSString* const kInvalidAppIdAlert                        = @"MoEngage - Provide the APP ID for your MoEngage App in Info.plist for key MoEngage_APP_ID to proceed. To get the AppID login to your MoEngage account, after that go to Settings -> App Settings. You will find the App ID in this screen.";
NSString* const kInvalidDataCenterAlert                   = @"MoEngage - Invalid DataCenter";

NSString* const kInAppShown         = @"MoEInAppCampaignShown";
NSString* const kInAppDismissed     = @"MoEInAppCampaignDismissed";
NSString* const kInAppClicked       = @"MoEInAppCampaignClicked";
NSString* const kInAppCustomAction  = @"MoEInAppCampaignCustomAction";
NSString* const kInAppSelfHandled   = @"MoEInAppCampaignSelfHandled";
NSString* const kPushTokenGenerated = @"MoEPushTokenGenerated";
NSString* const kPushClicked        = @"MoEPushClicked";
NSString* const kPermissionResult   = @"MoEPermissionResult";

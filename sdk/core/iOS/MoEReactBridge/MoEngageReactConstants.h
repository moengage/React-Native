//
//  MoEngageReactConstants.h
//  ReactNativeMoEngage
//
//  Created by Rakshitha C D on 10/02/21.
//  Copyright © 2020 MoEngage. All rights reserved.
//

#import <Foundation/Foundation.h>

// The MoEngage React Native SDK builds only against the New Architecture —
// old architecture support has been removed.
//
// Scoped to C++/Objective-C++ on purpose. CocoaPods puts
// `-DRCT_NEW_ARCH_ENABLED=1` in OTHER_CPLUSPLUSFLAGS only (React Native's
// scripts/cocoapods/new_architecture.rb, `computeFlags`), so plain `.m`
// translation units never see the macro there and an unscoped check would fail
// every CocoaPods build. When the New Architecture is off that flag is omitted
// entirely rather than set to 0, which is why this tests defined-ness. Under
// SwiftPM the define is set for both C and C++ (see Package.swift), so the
// guard holds on that path too.
#ifdef __cplusplus
#ifndef RCT_NEW_ARCH_ENABLED
#error "MoEngage React Native SDK supports only the New Architecture. Old architecture support has been removed — enable the New Architecture in your app (RCT_NEW_ARCH_ENABLED=1)."
#endif
#endif


//Info.plist keys
extern NSString* const kMoEngage;
extern NSString* const kAppId;
extern NSString* const kDataCenter;
extern NSString* const kAppGroupId;
extern NSString* const kDisablePeriodicFlush;
extern NSString* const kPeriodicFlushDuration;
extern NSString* const kEncryptNetworkRequests;
extern NSString* const kOptOutDataTracking;
extern NSString* const kOptOutIDFATracking;
extern NSString* const kOptOutIDFVTracking;
extern NSString* const kEnableLogs;

//DataCenter Constants
extern NSString* const kDataCenter1;
extern NSString* const kDataCenter2;
extern NSString* const kDataCenter3;
extern NSString* const kDataCenter4;
extern NSString* const kDataCenter5;


//PayLoad Constants
extern NSString* const kPayload;
extern NSString* const kEventName;
extern NSString* const kPayloadDict;
extern NSString* const kEventEmitted;

extern NSString* const kInvalidAppIdAlert;
extern NSString* const kInvalidDataCenterAlert;

extern NSString* const kInAppShown;
extern NSString* const kInAppDismissed;
extern NSString* const kInAppClicked;
extern NSString* const kInAppCustomAction;
extern NSString* const kInAppSelfHandled;
extern NSString* const kPushTokenGenerated;
extern NSString* const kPushClicked;
extern NSString* const kPermissionResult;
extern NSString* const kLogoutComplete;
extern NSString* const kAuthenticationError;

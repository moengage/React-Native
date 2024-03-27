//
//  MoEReactGeofence.h
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha on 14/03/24.
//


#import "MoEReactInbox.h"
#import "MoEReactNativeInboxHandler.h"

@implementation MoEReactInbox

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(fetchAllMessages:(NSString*)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeInboxHandler sharedInstance] getInboxMessages:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getUnClickedCount:(NSString*)payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeInboxHandler sharedInstance] getUnClickedMessageCount:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(trackMessageClicked:(NSString *) payload) {
    [[MoEReactNativeInboxHandler sharedInstance] trackInboxClick: payload];
}

RCT_EXPORT_METHOD(deleteMessage:(NSString *) payload) {
    [[MoEReactNativeInboxHandler sharedInstance] deleteInboxEntry: payload];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeMoEngageInboxSpecJSI>(params);
}
#endif

@end

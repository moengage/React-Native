//
//  MoEReactGeofence.h
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha on 14/03/24.
//


#import "MoEReactInbox.h"

// The codegen'd TurboModule spec header chain is Objective-C++ only
// (RCTRequired.h includes <utility>), so it is imported here rather than
// in the public header: under Swift Package Manager the public headers
// form a Clang module umbrella, and a spec import there breaks every
// plain Objective-C (.m) consumer of this module. The New-Architecture
// conformance is declared in a class extension instead.
#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageInboxSpec/NativeMoEngageInboxSpec.h>
@interface MoEReactInbox () <NativeMoEngageInboxSpec>
@end
#endif
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

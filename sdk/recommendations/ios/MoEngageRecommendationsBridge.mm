// MoEngageRecommendationsBridge.mm

#import "MoEngageRecommendationsBridge.h"

// The codegen'd TurboModule spec header chain is Objective-C++ only
// (RCTRequired.h includes <utility>), so it is imported here rather than
// in the public header: under Swift Package Manager the public headers
// form a Clang module umbrella, and a spec import there breaks every
// plain Objective-C (.m) consumer of this module. The New-Architecture
// conformance is declared in a class extension instead.
#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageRecommendationsSpec/NativeMoEngageRecommendationsSpec.h>
@interface MoEngageRecommendationsBridge () <NativeMoEngageRecommendationsSpec>
@end
#endif
#import "MoEReactNativeRecommendationsHandler.h"

@implementation MoEngageRecommendationsBridge

RCT_EXPORT_MODULE()

#pragma mark - Fetch APIs

RCT_EXPORT_METHOD(fetchRecommendations:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeRecommendationsHandler sharedInstance] fetchRecommendations:payload resolve:resolve reject:reject];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeMoEngageRecommendationsSpecJSI>(params);
}
#endif

@end

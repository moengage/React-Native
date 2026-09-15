// MoEngagePersonalizeBridge.mm

#import "MoEngagePersonalizeBridge.h"

// The codegen'd TurboModule spec header chain is Objective-C++ only
// (RCTRequired.h includes <utility>), so it is imported here rather than
// in the public header: under Swift Package Manager the public headers
// form a Clang module umbrella, and a spec import there breaks every
// plain Objective-C (.m) consumer of this module. The New-Architecture
// conformance is declared in a class extension instead.
#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngagePersonalizeSpec/NativeMoEngagePersonalizeSpec.h>
@interface MoEngagePersonalizeBridge () <NativeMoEngagePersonalizeSpec>
@end
#endif
#import "MoEReactNativePersonalizeHandler.h"

@implementation MoEngagePersonalizeBridge

RCT_EXPORT_MODULE()

#pragma mark - Fetch APIs

RCT_EXPORT_METHOD(fetchExperiencesMeta:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativePersonalizeHandler sharedInstance] fetchExperiencesMeta:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchExperiences:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativePersonalizeHandler sharedInstance] fetchExperiences:payload resolve:resolve reject:reject];
}

#pragma mark - Experience Tracking

RCT_EXPORT_METHOD(experiencesShown:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] experiencesShown:payload];
}

RCT_EXPORT_METHOD(experienceClicked:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] experienceClicked:payload];
}

#pragma mark - Offering Tracking

RCT_EXPORT_METHOD(offeringsShown:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] offeringsShown:payload];
}

RCT_EXPORT_METHOD(offeringClicked:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] offeringClicked:payload];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeMoEngagePersonalizeSpecJSI>(params);
}
#endif

@end

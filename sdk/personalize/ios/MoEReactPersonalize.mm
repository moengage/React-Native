//
//  MoEReactPersonalize.mm
//  ReactNativeMoEngagePersonalize
//

#import "MoEReactPersonalize.h"
#import "MoEReactNativePersonalizeHandler.h"

@implementation MoEReactPersonalize

RCT_EXPORT_MODULE()

#pragma mark - Fetch APIs

RCT_EXPORT_METHOD(fetchExperiencesMeta:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativePersonalizeHandler sharedInstance] fetchExperiencesMeta:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchExperiences:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativePersonalizeHandler sharedInstance] fetchExperiences:payload resolve:resolve reject:reject];
}

#pragma mark - Experience Tracking

RCT_EXPORT_METHOD(trackExperienceShown:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] trackExperienceShown:payload];
}

RCT_EXPORT_METHOD(trackExperienceClicked:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] trackExperienceClicked:payload];
}

#pragma mark - Offering Tracking

RCT_EXPORT_METHOD(trackOfferingShown:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] trackOfferingShown:payload];
}

RCT_EXPORT_METHOD(trackOfferingClicked:(NSString *)payload) {
    [[MoEReactNativePersonalizeHandler sharedInstance] trackOfferingClicked:payload];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeMoEngagePersonalizeSpecJSI>(params);
}
#endif

@end

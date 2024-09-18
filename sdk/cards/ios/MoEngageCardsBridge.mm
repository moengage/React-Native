// MoEngageCardsBridge.m

#import "MoEngageCardsBridge.h"
#import "MoEngageCardsReactConstants.h"
#import "MoEReactNativeCardsHandler.h"

@implementation MoEngageCardsBridge

{
    bool hasListeners;
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[kCardsSyncListener, kPullToRefreshCardsSyncListener, kInboxOpenCardsSyncListener];
}

RCT_EXPORT_MODULE();

#pragma mark- Initialize methods

RCT_EXPORT_METHOD(initialize:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] initialize:payload];
    [MoEReactNativeCardsHandler sharedInstance].eventEmitter = self;
}

#pragma mark- Callback method
RCT_EXPORT_METHOD(isAllCategoryEnabled:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] isAllCategoryEnabled:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getCardsCategories:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] getCardsCategories:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getCardsInfo:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] getCardsInfo:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getCardsForCategory:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] getCardsForCategory:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(fetchCards:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] fetchCards:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getNewCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] getNewCardsCount:payload resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(getUnClickedCardsCount:(NSString *) payload resolve:(RCTPromiseResolveBlock) resolve reject:(RCTPromiseRejectBlock)reject) {
    [[MoEReactNativeCardsHandler sharedInstance] getUnClickedCardsCount:payload resolve:resolve reject:reject];
}

#pragma mark- Listener methods
RCT_EXPORT_METHOD(refreshCards:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] refreshCards:payload];
}

RCT_EXPORT_METHOD(onCardSectionLoaded:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] onCardSectionLoaded:payload];
}

RCT_EXPORT_METHOD(onCardSectionUnLoaded:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] onCardSectionUnLoaded:payload];
}

#pragma mark- Stats methods
RCT_EXPORT_METHOD(cardClicked:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] cardClicked:payload];
}

RCT_EXPORT_METHOD(cardDelivered:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] cardDelivered:payload];
}

RCT_EXPORT_METHOD(cardShown:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] cardShown:payload];
}

RCT_EXPORT_METHOD(deleteCards:(NSString *) payload) {
    [[MoEReactNativeCardsHandler sharedInstance] deleteCards:payload];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeMoEngageCardsSpecJSI>(params);
}
#endif

@end

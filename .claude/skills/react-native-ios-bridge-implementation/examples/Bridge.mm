//
//  MoEngage<featureNameCamel>Bridge.mm
//
//  Replace <featureNameCamel> with PascalCase feature name (e.g. Cards).
//  Replace <iosHandlerName> with the resolved handler class (e.g. MoEReactNativeCardsHandler).
//  Real reference: sdk/cards/ios/MoEngageCardsBridge.mm
//

#import "MoEngage<featureNameCamel>Bridge.h"
#import "MoEngage<featureNameCamel>ReactConstants.h"
#import "<iosHandlerName>.h"

@implementation MoEngage<featureNameCamel>Bridge

{
    bool hasListeners;
}

// ── Include startObserving / stopObserving / supportedEvents ONLY if event methods exist ──

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

// List all nativeToHybrid event name constants here.
// Remove this method entirely if there are no event methods.
- (NSArray<NSString *> *)supportedEvents {
    return @[kOn<featureNameCamel>Event /* replace with actual event name constants */];
}

RCT_EXPORT_MODULE();

// ── INITIALIZE ────────────────────────────────────────────────────────────────
// Include ONLY if event methods exist. Sets the eventEmitter on the handler so
// the delegate can call sendEventWithName:body: later.
RCT_EXPORT_METHOD(initialize:(NSString *)payload) {
    [[<iosHandlerName> sharedInstance] initialize:payload];
    [<iosHandlerName> sharedInstance].eventEmitter = self;
}

// ── FIRE-AND-FORGET methods ───────────────────────────────────────────────────
// Delegates directly to the handler. No resolve/reject.
RCT_EXPORT_METHOD(<methodName>:(NSString *)payload) {
    [[<iosHandlerName> sharedInstance] <methodName>:payload];
}

// ── EVENT TRIGGER methods (hybridToNative side of an event) ──────────────────
// JS calls this to ask native to fetch and push data back via the event emitter.
// Delegates to the handler method which calls the plugin-base — NOT initialize:.
RCT_EXPORT_METHOD(<eventTriggerMethodName>:(NSString *)payload) {
    [[<iosHandlerName> sharedInstance] <eventTriggerMethodName>:payload];
}

// ── PROMISE methods ───────────────────────────────────────────────────────────
// Delegates resolve/reject blocks to the handler.
RCT_EXPORT_METHOD(<methodName>:(NSString *)payload resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[<iosHandlerName> sharedInstance] <methodName>:payload resolve:resolve reject:reject];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeMoEngage<featureNameCamel>SpecJSI>(params);
}
#endif

@end

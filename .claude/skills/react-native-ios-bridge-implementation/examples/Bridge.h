//
//  MoEngage<featureNameCamel>Bridge.h
//
//  Replace <featureNameCamel> with the PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEngageCardsBridge.h
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngage<featureNameCamel>Spec/NativeMoEngage<featureNameCamel>Spec.h>
// TODO: verify TurboModule spec header name
#endif

@class MoEngage<featureNameCamel>ReactUtil;

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEngage<featureNameCamel>Bridge : RCTEventEmitter <NativeMoEngage<featureNameCamel>Spec>
@end
#else
@interface MoEngage<featureNameCamel>Bridge : RCTEventEmitter <RCTBridgeModule>
@end
#endif

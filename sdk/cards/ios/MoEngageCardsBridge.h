// MoEngageCardsBridge.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageCardsSpec/NativeMoEngageCardsSpec.h>
#endif

@class MoEngageCardsReactUtil;

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEngageCardsBridge : RCTEventEmitter <NativeMoEngageCardsSpec>
@end
#else
@interface MoEngageCardsBridge : RCTEventEmitter <RCTBridgeModule>
@end
#endif


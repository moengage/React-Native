// MoEngageCardsBridge.h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <NativeMoEngageCardsSpec/NativeMoEngageCardsSpec.h>

@class MoEngageCardsReactUtil;

@interface MoEngageCardsBridge : RCTEventEmitter <NativeMoEngageCardsSpec>
@end


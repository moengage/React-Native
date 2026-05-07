// MoEngagePersonalizeBridge.h

#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngagePersonalizeSpec/NativeMoEngagePersonalizeSpec.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEngagePersonalizeBridge : NSObject <NativeMoEngagePersonalizeSpec>
@end
#else
@interface MoEngagePersonalizeBridge : NSObject <RCTBridgeModule>
@end
#endif

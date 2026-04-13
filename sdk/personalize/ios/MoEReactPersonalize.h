
#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngagePersonalizeSpec/NativeMoEngagePersonalizeSpec.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEReactPersonalize : NSObject <NativeMoEngagePersonalizeSpec>
@end
#else
@interface MoEReactPersonalize : NSObject <RCTBridgeModule>
@end
#endif

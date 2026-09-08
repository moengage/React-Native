
#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageInboxSpec/NativeMoEngageInboxSpec.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEReactInbox : NSObject <NativeMoEngageInboxSpec>
@end
#else
@interface MoEReactInbox : NSObject <RCTBridgeModule>
@end
#endif

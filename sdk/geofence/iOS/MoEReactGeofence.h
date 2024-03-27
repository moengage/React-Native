
#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageGeofenceSpec/NativeMoEngageGeofenceSpec.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface MoEReactGeofence : NSObject <NativeMoEngageGeofenceSpec>
@end
#else
@interface MoEReactGeofence : NSObject <RCTBridgeModule>
@end
#endif

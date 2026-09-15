//
//  MoEReactGeofence.h
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha on 14/03/24.
//

#import "MoEReactGeofence.h"

// The codegen'd TurboModule spec header chain is Objective-C++ only
// (RCTRequired.h includes <utility>), so it is imported here rather than
// in the public header: under Swift Package Manager the public headers
// form a Clang module umbrella, and a spec import there breaks every
// plain Objective-C (.m) consumer of this module. The New-Architecture
// conformance is declared in a class extension instead.
#ifdef RCT_NEW_ARCH_ENABLED
#import <NativeMoEngageGeofenceSpec/NativeMoEngageGeofenceSpec.h>
@interface MoEReactGeofence () <NativeMoEngageGeofenceSpec>
@end
#endif
#import "MoEReactNativeGeofenceHandler.h"

@implementation MoEReactGeofence

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(startGeofenceMonitoring:(NSString *) payload) {
    [[MoEReactNativeGeofenceHandler sharedInstance] startGeofenceMonitoring:payload];
}

RCT_EXPORT_METHOD(stopGeofenceMonitoring:(NSString *) payload) {
    [[MoEReactNativeGeofenceHandler sharedInstance] stopGeofenceMonitoring:payload];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeMoEngageGeofenceSpecJSI>(params);
}
#endif

@end

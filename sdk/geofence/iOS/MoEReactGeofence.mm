//
//  MoEReactGeofence.h
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha on 14/03/24.
//

#import "MoEReactGeofence.h"
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

#import "MoEReactGeofence.h"

@implementation MoEReactGeofence

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(startGeofenceMonitoring:(NSDictionary *) payload) {
    [[MoEngagePluginGeofenceBridge sharedInstance] startGeofenceMonitoring: payload];
}

RCT_EXPORT_METHOD(stopGeofenceMonitoring:(NSDictionary *) payload) {
    [[MoEngagePluginGeofenceBridge sharedInstance] stopGeofenceMonitoring:payload];
}

@end

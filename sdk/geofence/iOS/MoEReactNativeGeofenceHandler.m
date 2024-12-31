//
//  MoEReactNativeHandler.m
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha on 14/03/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeGeofenceHandler.h"
#import "MoEReactNativeGeofenceUtil.h"

@import MoEngagePluginGeofence;

@interface MoEReactNativeGeofenceHandler()
@end

@implementation MoEReactNativeGeofenceHandler : NSObject

+(instancetype)sharedInstance{
    static dispatch_once_t onceToken;
    static MoEReactNativeGeofenceHandler *instance;
    dispatch_once(&onceToken, ^{
        instance = [[MoEReactNativeGeofenceHandler alloc] init];
    });
    return instance;
}

// MARK: Geofence methods
-(void)startGeofenceMonitoring:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEReactNativeGeofenceUtil getJSONRepresentation:payload];
    [[MoEngagePluginGeofenceBridge sharedInstance] startGeofenceMonitoring: jsonPayload];
}

-(void)stopGeofenceMonitoring:(NSString *)payload {
    NSDictionary* jsonPayload = [MoEReactNativeGeofenceUtil getJSONRepresentation:payload];
    [[MoEngagePluginGeofenceBridge sharedInstance] stopGeofenceMonitoring: jsonPayload];
}

@end

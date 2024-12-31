//
//  MoEReactNativeGeofenceUtil.m
//  ReactNativeMoEngageGeofence
//
//  Created by Rakshitha . on 26/12/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeGeofenceUtil.h"

@implementation MoEReactNativeGeofenceUtil: NSObject
+(NSDictionary*)getJSONRepresentation:(NSString*)string {
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonOutput = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return jsonOutput;
}

@end

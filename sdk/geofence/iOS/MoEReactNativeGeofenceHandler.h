//
//  MoEReactNativeGeofenceHandler.h
//  Pods
//
//  Created by Rakshitha on 14/03/24.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface MoEReactNativeGeofenceHandler: NSObject
+(instancetype)sharedInstance;

-(void)startGeofenceMonitoring:(NSString *)payload;
-(void)stopGeofenceMonitoring:(NSString *)payload;
@end


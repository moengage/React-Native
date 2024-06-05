//
//  MoEReactCustomBridge.m
//  SampleApp
//
//  Created by Rakshitha on 04/06/24.
//

#import "AppReactBridge.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <React/RCTBundleURLProvider.h>
#import <MoEngageSDK/MoEngageSDK.h>
#import "Utility.h"
#import "Constants.h"

@interface AppReactBridge()
@end

@implementation AppReactBridge

{
  bool hasListeners;
}

RCT_EXPORT_MODULE(AppReactBridge);
#pragma mark- Observers
// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = true;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = false;
}

#pragma mark- Event Emitters
- (NSArray<NSString *> *)supportedEvents
{
    return @[kLogOutComplete];
}

#pragma mark- Initialization Method

-(void)sendEvent:(NSString *)name body:(id)body {
  if (hasListeners) {
    [self sendEventWithName:name body:body];
  }
}

RCT_EXPORT_METHOD(logout) {
  [[MoEngageSDKAnalytics sharedInstance] resetUserWithCompletionBlock:^(BOOL isResetDone) {
    [self sendEvent:kLogOutComplete body:nil];
  }];
}

RCT_EXPORT_METHOD(updateAppId:(NSString*)appId) {
  NSLog(@"Updating the appId to %@", appId);
  [Utility updateAppId:appId];
}

@end

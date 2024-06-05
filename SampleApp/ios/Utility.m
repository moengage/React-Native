//
//  Utility.m
//  SampleApp
//
//  Created by Rakshitha on 05/06/24.
//

#import <Foundation/Foundation.h>

#import <Foundation/Foundation.h>
#import "Utility.h"
#import "Constants.h"

@implementation Utility

+ (NSString *)fetchAppId {
  NSString* appId = [[NSUserDefaults standardUserDefaults] objectForKey:kAppId];
  if (appId.length == 0) {
    appId = kDefaultAppId;
  }
  
  return appId;
}

+ (void)updateAppId:(NSString *)appId {
  [[NSUserDefaults standardUserDefaults] setObject:appId forKey:kAppId];
}
@end

//
//  NotificationService.m
//  NotificationService
//
//  Created by Rakshitha on 17/08/21.
//

#import "NotificationService.h"
@import  MoEngageRichNotification;

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  
  @try {
    
    [MoEngageSDKRichNotification setAppGroupID:@"group.com.alphadevs.MoEngage.NotificationServices"];
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    [MoEngageSDKRichNotification handleWithRichNotificationRequest: request withContentHandler:contentHandler];
  } @catch (NSException *exception) {
    NSLog(@"MoEngage : exception : %@",exception);
  }
}

- (void)serviceExtensionTimeWillExpire {
  // Called just before the extension will be terminated by the system.
  // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
  self.contentHandler(self.bestAttemptContent);
}

@end

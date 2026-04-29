#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

@class RCTReactNativeFactory;

@interface AppDelegate : UIResponder <UIApplicationDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RCTReactNativeFactory *reactNativeFactory;

@end

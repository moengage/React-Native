#import <React-RCTAppDelegate/RCTReactNativeFactory.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RCTReactNativeFactory *reactNativeFactory;

@end

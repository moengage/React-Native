#import "MoEReactInbox.h"

@implementation MoEReactInbox

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(fetchAllMessages:(NSDictionary*)payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
    [[MoEngagePluginInboxBridge sharedInstance] getInboxMessages:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull inboxMessages) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:inboxMessages options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            resolver(strPayload);
        } else {
            rejecter(@"Error", @"Error in fetching inbox messages", [NSError errorWithDomain:@"" code:400 userInfo:@{@"Error reason": @"Error in fetching response"}]);
        }
    }];
}

RCT_EXPORT_METHOD(getUnClickedCount:(NSDictionary*)payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
    
    [[MoEngagePluginInboxBridge sharedInstance] getUnreadMessageCount:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull payload) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization  dataWithJSONObject:payload options:0 error:&err];
        if (jsonData) {
            NSString *strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            resolver(strPayload);
        } else {
            rejecter(@"Error", @"Error in fetching inbox unclicked message count", [NSError errorWithDomain:@"" code:400 userInfo:@{@"Error reason": @"Error in fetching response"}]);
        }
        
    }];
}

RCT_EXPORT_METHOD(trackMessageClicked:(NSDictionary *) campaignInfo) {
    [[MoEngagePluginInboxBridge sharedInstance] trackInboxClick:campaignInfo];
}

RCT_EXPORT_METHOD(deleteMessage:(NSDictionary *) campaignInfo) {
    [[MoEngagePluginInboxBridge sharedInstance] deleteInboxEntry:campaignInfo];
}

@end

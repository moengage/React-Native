// MoEngageCardsBridge.m

#import "MoEngageCardsBridge.h"
#import "MoEngageCardsReactConstants.h"
#import "MoEngageCardsReactUtil.h"

@interface MoEngageCardsBridge() <MoEngageCardSyncDelegate>
@end

@implementation MoEngageCardsBridge
{
    bool hasListeners;
}
// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
    
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[kAppOpenCardsSyncListener, kPullToRefreshCardsSyncListener, kInboxOpenCardsSyncListener];
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] initialize:payload];
    [[MoEngagePluginCardsBridge sharedInstance] setAppOpenSyncListener:payload];
    [[MoEngagePluginCardsBridge sharedInstance] setSyncEventListnerDelegate:self];
}

RCT_EXPORT_METHOD(isAllCategoryEnabled:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] isAllCategoryEnabled:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}


RCT_EXPORT_METHOD(getCardsCategories:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] getCardsCategories:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}


RCT_EXPORT_METHOD(getCardsInfo:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] getCardsInfo:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}

RCT_EXPORT_METHOD(getCardsForCategory:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] getCardsForCategory:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}

RCT_EXPORT_METHOD(fetchCards:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] fetchCards:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}


RCT_EXPORT_METHOD(getNewCardsCount:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] getNewCardsCount:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}


RCT_EXPORT_METHOD(getUnClickedCardsCount:(NSDictionary *) payload resolver:(RCTPromiseResolveBlock) resolver rejecter:(RCTPromiseRejectBlock)rejecter)
{
    [[MoEngagePluginCardsBridge sharedInstance] getUnClickedCardsCount:payload completionHandler:^(NSDictionary<NSString *,id> * _Nonnull cardPayload) {
        [MoEngageCardsReactUtil handleDataToReact:cardPayload rejecter:rejecter resolver:resolver];
    }];
}

RCT_EXPORT_METHOD(refreshCards:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] refreshCards:payload];
}


RCT_EXPORT_METHOD(onCardSectionLoaded:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionLoaded:payload];
}

RCT_EXPORT_METHOD(onCardSectionUnLoaded:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] onCardsSectionUnLoaded:payload];
}

RCT_EXPORT_METHOD(cardClicked:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] cardClicked:payload];
}

RCT_EXPORT_METHOD(cardDelivered:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] cardDelivered:payload];
}

RCT_EXPORT_METHOD(cardShown:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] cardShown:payload];
}

RCT_EXPORT_METHOD(deleteCards:(NSDictionary *) payload)
{
    [[MoEngagePluginCardsBridge sharedInstance] deleteCards:payload];
}

- (void)syncCompleteForEventType:(enum MoEngageCardsSyncEventType)eventType withData:(NSDictionary<NSString *,id> *)data {
    
    NSMutableDictionary* updatedDict = [NSMutableDictionary dictionary];
    NSString* eventName = [MoEngageCardsReactUtil fetchSyncType:eventType];
    
    if (hasListeners && eventName && data) {
        NSError *err;
        NSData * jsonData = [NSJSONSerialization dataWithJSONObject:data options:0 error:&err];
        if (jsonData) {
            NSString* strPayload = [[NSString alloc] initWithData:jsonData  encoding:NSUTF8StringEncoding];
            updatedDict[kPayload] = strPayload;
            [self sendEventWithName:eventName body:updatedDict];
        } else {
            NSLog(@"Error converting to dictionary to string %@", err.localizedDescription);
        }
    }
}

@end

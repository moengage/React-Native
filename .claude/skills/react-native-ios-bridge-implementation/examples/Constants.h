//
//  MoEngage<featureNameCamel>ReactConstants.h
//
//  Replace <featureNameCamel> with PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEngageCardsReactConstants.h
//

#import <Foundation/Foundation.h>

// Shared payload key — define locally if not already available from core:
extern NSString* const kPayload;

// One constant per nativeToHybrid event name (omit section if no events):
extern NSString* const kOn<featureNameCamel>Event;  // e.g. kCardsSyncListener = @"onCardsSync"

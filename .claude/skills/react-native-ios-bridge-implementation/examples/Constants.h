//
//  MoEngage<featureNameCamel>ReactConstants.h
//
//  Replace <featureNameCamel> with PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEngageCardsReactConstants.h
//

#import <Foundation/Foundation.h>

// NOTE: shared globals like kPayload come from core's MoEngageReactConstants.h
// — never re-declare/define them here (duplicate-symbol link failure under
// React Native's SwiftPM integration). Only feature-specific constants below.

// One constant per nativeToHybrid event name (omit section if no events):
extern NSString* const kOn<featureNameCamel>Event;  // e.g. kCardsSyncListener = @"onCardsSync"

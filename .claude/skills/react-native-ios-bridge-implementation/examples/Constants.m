//
//  MoEngage<featureNameCamel>ReactConstants.m
//
//  Replace <featureNameCamel> with PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEngageCardsReactConstants.m
//

#import "MoEngage<featureNameCamel>ReactConstants.h"

// NOTE: do NOT define kPayload (or any other core global) here — it is
// defined in core's MoEngageReactConstants.m. A duplicate definition fails
// the app link under React Native's SwiftPM integration (duplicate symbol).
// #import "MoEngageReactConstants.h" in the file that needs it instead.

// Event name values must exactly match the TS Constants.ts event name strings:
NSString* const kOn<featureNameCamel>Event = @"on<featureNameCamel>Event";

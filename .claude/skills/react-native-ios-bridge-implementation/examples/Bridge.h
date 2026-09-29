//
//  MoEngage<featureNameCamel>Bridge.h
//
//  Replace <featureNameCamel> with the PascalCase feature name (e.g. Cards).
//  Real reference: sdk/cards/ios/MoEngageCardsBridge.h
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class MoEngage<featureNameCamel>ReactUtil;

// NOTE: the TurboModule spec is deliberately NOT imported here — its header
// chain is Objective-C++ only (RCTRequired.h includes <utility>), and under
// Swift Package Manager a target's public headers form a Clang module
// umbrella, so importing it here breaks every plain ObjC (.m) consumer of this
// module. The New-Architecture conformance is declared in a class extension in
// the .mm instead; this declaration is valid for both architectures.
@interface MoEngage<featureNameCamel>Bridge : RCTEventEmitter <RCTBridgeModule>
@end

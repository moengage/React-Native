//
//  MoEngageCardsReactConstants.h
//  Pods
//
//  Created by Rakshitha on 09/08/23.
//

#import <Foundation/Foundation.h>


// kPayload is declared in MoEngageReactConstants.h (react-native-moengage core)
// and defined there; a second definition here caused a duplicate-symbol link
// failure when both packages are linked from whole-target objects (SPM).
extern NSString* const kCardsSyncListener;
extern NSString* const kPullToRefreshCardsSyncListener;
extern NSString* const kInboxOpenCardsSyncListener;

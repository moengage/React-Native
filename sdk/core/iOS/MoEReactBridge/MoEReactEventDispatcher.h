//
//  MoEReactEventDispatcher.h
//  ReactNativeMoEngage
//
//  Created by Rakshitha . on 03/01/25.
//

#import <Foundation/Foundation.h>

@protocol MoEReactEventDispatcher <NSObject>

-(void)sendEventWithName:(NSDictionary *)payloadDict;

@end

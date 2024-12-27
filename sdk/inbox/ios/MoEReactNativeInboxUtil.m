//
//  MoEReactNativeInboxUtil.m
//  ReactNativeMoEngageInbox
//
//  Created by Rakshitha . on 26/12/24.
//

#import <Foundation/Foundation.h>
#import "MoEReactNativeInboxUtil.h"

@implementation MoEReactNativeInboxUtil: NSObject
+(NSDictionary*)getJSONRepresentation:(NSString*)string {
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonOutput = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return jsonOutput;
}

@end

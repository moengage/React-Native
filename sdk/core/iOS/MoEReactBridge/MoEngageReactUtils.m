//
//  MoEngageReactUtils.m
//  CocoaAsyncSocket
//
//  Created by Rakshitha on 14/02/23.
//

#import <Foundation/Foundation.h>
#import "MoEngageReactUtils.h"

@implementation MoEngageReactUtils
+(NSInteger)getIntegerForKey:(NSString *)key dict:(NSDictionary*)dict {
    
    NSString *value = [self stringForkey:key dict:dict];
    if (value == NULL) {
        return -1;
    }
    return [value integerValue];
}

+(NSString * __nullable)stringForkey:(NSString *)key dict:(NSDictionary*)dict {
    if (key == NULL || key.length == 0) {
        return NULL;
    }
    id value = [dict objectForKey:key];
    if (value) {
        return [NSString stringWithFormat:@"%@", value];
    }
    return NULL;
}

+(BOOL)getBooleanForKey:(NSString *)key dict:(NSDictionary*)dict {
    
    NSString *value = [self stringForkey:key dict:dict];
    if (value == NULL) {
        return NO;
    }
    return [value boolValue];
}

+(NSDictionary*)getJSONRepresentation:(NSString*)string {
    NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonOutput = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    return jsonOutput;
}
@end

//
//  MoEngageReactUtils.h
//  Pods
//
//  Created by Rakshitha on 14/02/23.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface MoEngageReactUtils : NSObject
+(NSInteger)getIntegerForKey:(NSString *)key dict:(NSDictionary*)dict;
+(BOOL)getBooleanForKey:(NSString *)key dict:(NSDictionary*)dict;
+(NSDictionary*)getJSONRepresentation:(NSString*)string;
@end

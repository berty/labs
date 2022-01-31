#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LabsBridge, NSObject)

RCT_EXTERN_METHOD(start:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
 return YES;  // only do this if your module initialization relies on calling UIKit!
}

@end

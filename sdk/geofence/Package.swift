// swift-tools-version: 6.0
// Swift Package Manager manifest for React Native's experimental SPM support
// (react-native >= 0.87, `npx react-native spm`). CocoaPods integration keeps
// using ReactNativeMoEngageGeofence.podspec — this file is only consumed by
// React Native's SPM autolinker.
//
// The autolinker references this package through a symlink at
// <app>/build/generated/autolinking/libs/ReactNativeMoEngageGeofence, so the
// relative `.package(path:)` entries below resolve against that location:
//   ../../../../xcframeworks -> <app>/build/xcframeworks   (ReactNative package)
//   ../../../ios             -> <app>/build/generated/ios  (React-GeneratedCode)
//   ../ReactNativeMoEngage   -> the react-native-moengage core package symlink
//
// The same symlink anchoring applies to the commented-out "For development"
// entries in `dependencies`: eight levels up from the symlink is the directory
// that holds sibling checkouts of the MoEngage native repos. That depth is a
// property of where the consuming app lives — it is correct for SpmSampleApp
// (<repo>/SpmSampleApp/ios), and has to be recounted for any other app.
//
// The product name must match the `spm.name` override declared in this
// package's react-native.config.js — that is how the autolinker learns to
// look it up as "ReactNativeMoEngageGeofence" rather than the name it would otherwise derive.

import PackageDescription

let package = Package(
    name: "ReactNativeMoEngageGeofence",
    // The podspec floor is iOS 13, but SwiftPM forbids a target declaring a
    // floor below the products it consumes, and React Native's generated
    // codegen package (ReactAppHeaders) declares .iOS(.v15). SPM consumers are
    // therefore bound to iOS 15; CocoaPods consumers keep iOS 13.
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "ReactNativeMoEngageGeofence", targets: ["ReactNativeMoEngageGeofence"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        .package(name: "ReactNativeMoEngage", path: "../ReactNativeMoEngage"),
        .package(url: "https://github.com/moengage/apple-plugin-geofence.git", exact: "5.02.0"),
        // For development against a local checkout, comment the line above
        // and uncomment this one:
        // .package(path: "../../../../../../../../apple-plugin-geofence"),
    ],
    targets: [
        .target(
            name: "ReactNativeMoEngageGeofence",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
                .product(name: "ReactNativeMoEngage", package: "ReactNativeMoEngage"),
                .product(name: "MoEngagePluginGeofence", package: "apple-plugin-geofence"),
            ],
            path: "iOS",
            exclude: ["MoEReactGeofence.xcodeproj"],
            // All headers are public, matching CocoaPods. The bridge headers keep
            // the ObjC++ only TurboModule spec import in their .mm instead, so
            // this module's Clang umbrella stays compilable from plain ObjC.
            publicHeadersPath: ".",
            // RCT_NEW_ARCH_ENABLED must be defined for BOTH the plain ObjC (.m)
            // and ObjC++ (.mm) sources: the bridge headers switch the class's
            // protocol conformance on it, so a mismatch across translation
            // units breaks the TurboModule. CocoaPods sets this on pod targets
            // under the New Architecture; SwiftPM does not, and without it
            // React Native 0.87 never dispatches to the module (legacy module
            // interop is disabled by default).
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED"),
                // Match the prebuilt React.framework's config-gated C++ ABI
                // (NDEBUG in Release changes Fabric's ShadowNode layout).
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("CoreGraphics"),
                .linkedFramework("CoreLocation"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)

#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/hybrid/npm-verification.main.kts")
@file:Import("../scripts/react-utils.main.kts")

when (val platform = args[0]) {
    "iOS" -> {
        verifyPullRequest(
            plugins= getAllPluginsPath(), 
            coreModule= "sdk/core", 
            platform= PLATFORM.IOS
        )
    }

    "android-sample" -> {
        verifyPullRequest(
            plugins= getAllPluginsPath(),
            coreModule= "sdk/core",
            platform= PLATFORM.ANDROID_SAMPLE
        )
    }

    "android-expo" -> {
        verifyPullRequest(
            plugins= getAllPluginsPath(),
            coreModule= "sdk/core",
            platform= PLATFORM.ANDROID_EXPO
        )
    }

    "react-native" -> {
        verifyPullRequest(
            plugins= getAllPluginsPath(), 
            coreModule= "sdk/core", 
            platform= PLATFORM.HYBRID
        )
    }
}
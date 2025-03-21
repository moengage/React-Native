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

    "android" -> {
        verifyPullRequest(
            plugins= getAllPluginsPath(), 
            coreModule= "sdk/core", 
            platform= PLATFORM.ANDROID
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
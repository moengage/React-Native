#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/hybrid/npm-verification.main.kts")
@file:Import("../scripts/react-utils.main.kts")

verifyPullRequest(getAllPluginsPath(), "sdk/core")
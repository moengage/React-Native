#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/verification/npm-verification.main.kts")
@file:Import("../scripts/utils.main.kts")

verifyPullRequest(getAllPluginsPath(), "sdk/core")
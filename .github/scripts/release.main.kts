#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/hybrid/npm-release.main.kts")
@file:Import("../scripts/react-utils.main.kts")

releasePlugins(getAllPluginsPath(), false)
#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/npm-release.main.kts"")
@file:Import("../scripts/utils.main.kts")

releasePlugins(getAllPluginsPath(), false)
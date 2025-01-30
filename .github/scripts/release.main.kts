#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/hybrid/npm-release.main.kts")
@file:Import("../scripts/react-utils.main.kts")

private val changelogRefLink = args[0]
releasePlugins(
    pluginsPath = getAllPluginsPath(), 
    isBuildRequired = false, 
    shouldCreateRelease = true, 
    changelogRefLink = changelogRefLink
)
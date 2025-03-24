#!/usr/bin/env kotlin

@file:Import("../../../sdk-automation-scripts/scripts/hybrid/npm-release.main.kts")
@file:Import("../scripts/react-utils.main.kts")

private val changelogRefLink = args[0]
private val releaseTicketNumber = args[1]
releasePlugins(
    pluginsPath = getAllPluginsPath(), 
    isBuildRequired = false, 
    releaseTicket = releaseTicketNumber,
    shouldCreateRelease = true, 
    changelogRefLink = changelogRefLink
)
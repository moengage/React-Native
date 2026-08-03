#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20240303")
@file:Import("../../../sdk-automation-scripts/scripts/hybrid/hybrid-utils.main.kts")
@file:Import("react-utils.main.kts")

val releaseBranch = "master"
val changelogFileName = "CHANGELOG.md"

private val releaseNotes = args[0]
private val releaseTicket = args[1]

preRelease(
    pluginsPath = getAllPluginsPath(),
    releaseTicket = releaseTicket,
    releaseNotes = releaseNotes
)

private fun preRelease(
    pluginsPath: Set<String>,
    releaseTicket: String,
    releaseNotes: String
) {
    executeCommandOrExitOnFailure("git checkout $releaseBranch")

    val releasingPlugins = preparePluginsToBeReleased(pluginsPath, releaseBranch, changelogFileName)
    val releasingPluginPaths = releasingPluginPathsJSON(releasingPlugins).toString(4)

    // write the release ticket and notes to release-workflow-inputs.json
    val inputJson = getReleaseWorkflowInputJSON(releaseTicket, releaseNotes)
    overrideFileContent(inputJson.toString(4), "./release/release-workflow-inputs.json")

    // write the releasing plugins to releasing-plugins.json
    overrideFileContent(releasingPluginPaths, "./release/releasing-plugins.json")

    println("Releasing Plugins: $releasingPlugins")
    // key by plugin name (not path) so the commit reads `Release [core-v1.2.3 ...]`
    val releasingPluginNames = releasingPlugins.mapKeys { it.key.split("/").last() }
    commitAndPush(getReleaseCommitMessage(releaseTicket, releasingPluginNames))
}

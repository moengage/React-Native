#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20240303")
@file:Import("../../../sdk-automation-scripts/scripts/common/utils.main.kts")

import org.json.JSONArray
import org.json.JSONObject

private val releaseBranch = "master"
private val releaseWorkflowInputsFile = "./release/release-workflow-inputs.json"
private val releasingPluginsFile = "./release/releasing-plugins.json"

releasePlugins()

private fun releasePlugins() {
    executeCommandOrExitOnFailure("git checkout $releaseBranch")
    executeCommandOrExitOnFailure("git pull origin $releaseBranch")

    // release inputs written by pre-release.main.kts
    val releaseInputs = JSONObject(getFileContent(releaseWorkflowInputsFile))
    val releaseNotes = releaseInputs.optString("releaseNotes")

    // get the release plugin list
    val pluginsToBeReleased = getReleasePlugins()
    if (pluginsToBeReleased.isEmpty()) {
        println("No plugins staged for release, exiting.")
        return
    }

    val tags = pluginsToBeReleased.map { pluginPath ->
    releaseAndTagPlugin(
        isBuildRequired = true,
        pluginPath = pluginPath,
        releaseVersion = getPluginVersionFromPackage(pluginPath)
        )
    }
    // push tags, then create the GitHub release for every released plugin
    pushLocalTags()
    tags.forEach { createGitRelease(it, releaseNotes) }
}

private fun getReleasePlugins(): List<String> {
    val releasePlugins = JSONArray(getFileContent(releasingPluginsFile))
    return (0 until releasePlugins.length()).map { releasePlugins.getString(it) }
}
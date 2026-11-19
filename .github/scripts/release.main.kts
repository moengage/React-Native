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

    // publish each plugin, then immediately tag it and create its GitHub release, so a failure
    // on a later plugin never leaves an earlier, already-published plugin without a tag/release.
    // Every step is skipped if already done, so a failed run can simply be re-run.
    for (pluginPath in pluginsToBeReleased) {
        val releaseVersion = getPluginVersionFromPackage(pluginPath)
        // same tag prefix rule as releaseAndTagPlugin: moengage.moduleName, else the folder name
        val tagPrefix = getPluginNameFromPackage(pluginPath).ifBlank { pluginPath.split("/").last() }
        val tag = getTagName(releaseVersion, tagPrefix)

        val shouldCreateRelease = !isGitReleaseCreated(tag)
        if (!shouldCreateRelease) {
            println("::notice:: GitHub release for $tag already exists, skipping")
        }

        if (isVersionPublishedOnNpm(pluginPath, releaseVersion)) {
            println("::notice:: Skipping publish of $pluginPath, version $releaseVersion is already on npm")
            if (isTagOnRemote(tag)) {
                println("::notice:: Tag $tag already exists on remote, skipping")
                if (shouldCreateRelease) createGitRelease(tag, releaseNotes)
            } else {
                // creates and pushes the tag, and creates the GitHub release if it is missing
                tagModuleWithLatestVersion(releaseVersion, tagPrefix, shouldCreateRelease, releaseNotes)
            }
        } else {
            releaseAndTagPlugin(
                isBuildRequired = true,
                pluginPath = pluginPath,
                releaseVersion = releaseVersion
            )
            executeCommandOrExitOnFailure("git push origin $tag")
            if (shouldCreateRelease) createGitRelease(tag, releaseNotes)
        }
    }
}

private fun getReleasePlugins(): List<String> {
    val releasePlugins = JSONArray(getFileContent(releasingPluginsFile))
    return (0 until releasePlugins.length()).map { releasePlugins.getString(it) }
}
#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20231013")
@file:Import("../../../sdk-automation-scripts/scripts/common/utils.main.kts")

import org.json.JSONObject
import java.io.File

/**
 * Script to create a map of folder name and version for all folders inside the sdk folder.
 * Reads the version from each module's package.json file.
 */

 private val releaseNotes = args[0]

val sdkFolderPath = File("sdk").canonicalFile

if (!sdkFolderPath.exists() || !sdkFolderPath.isDirectory) {
    println("Error: SDK folder not found at ${sdkFolderPath.absolutePath}")
    System.exit(1)
}

val sdkVersions = mutableMapOf<String, String>()

sdkFolderPath.listFiles()
    ?.filter { it.isDirectory }
    ?.forEach { folder ->
        val packageJsonFile = File(folder, "package.json")
        if (packageJsonFile.exists()) {
            try {
                val jsonContent = packageJsonFile.readText()
                val jsonObject = JSONObject(jsonContent)
                val version = jsonObject.optString("version", "unknown")
                sdkVersions[folder.name] = version
            } catch (e: Exception) {
                println("Warning: Failed to read version from ${packageJsonFile.absolutePath}: ${e.message}")
            }
        } else {
            println("Warning: package.json not found in ${folder.absolutePath}")
        }
    }

val versions = sdkVersions.toSortedMap()
    .map { (folder, version) -> "$folder: $version" }
    .joinToString("\n")

println("SDK Versions:\n$versions")

triggerReleaseNotification(mapOf(
  notifyReleaseFrameworkParameterName to "React Native SDK",
  notifyReleaseVersionParameterName to "Core version: ${sdkVersions["core"]}",
  notifyReleaseMessageParameterName to versions,
  notifyReleaseReleaseNotesParameterName to releaseNotes
))



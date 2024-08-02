#!/usr/bin/env kotlin

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

private val pluginsPath = setOf(
    "sdk/cards",
    "sdk/core",
    "sdk/geofence",
    "sdk/inbox"
)

/**
 * Returns all the plugins list
 */
fun getAllPluginsPath(): Set<String> = pluginsPath

/**
 * Returns the install-local command to install all plugins into sampleapp directory
 */
fun getInstallLocalCommand(): String {
    var command = "install-local "
    pluginsPath.forEach { module ->
        command += "../$module "
    }
    return command
}

/**
 * Create the local.properties file in given directory
 */
fun createLocalPropertiesFile(directory: String) {
    executeCommandOnShell(directory, "echo moengageAppId=\"Dummy MoEngage Key\" >> ./local.properties")
}
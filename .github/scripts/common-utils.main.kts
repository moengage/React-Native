#!/usr/bin/env kotlin

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

private val pluginsPath = setOf(
    "/sdk/cards",
    "/sdk/core",
    "/sdk/geofence",
    "/sdk/inbox"
)

/**
 * Executes the provided command in working directory on the bash shell.
 */
fun executeCommandOnShell(command: String): Int {
    val process = ProcessBuilder("/bin/bash", "-c", command).inheritIO().start()
    return process.waitFor()
}

/**
 * Executes the provided command in given directory on the bash shell.
 */
fun executeCommandOnShell(directory: String, command: String): Int {
    val process = ProcessBuilder("/bin/bash", "-c", command).inheritIO()
        .directory(File(directory)).start()
    return process.waitFor()
}

/**
 * Executes the given command on bash shell and returns the output as a string.
 */
fun executeShellCommandWithStringOutput(command: String): String {
    val process = ProcessBuilder("/bin/bash", "-c", command).start()
    val reader = BufferedReader(InputStreamReader(process.inputStream))
    var line: String?
    val builder = StringBuilder()
    while (reader.readLine().also { line = it } != null) {
        builder.append(line).append(System.getProperty("line.separator"))
    }
    return builder.toString().trim()
}

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
#!/usr/bin/env kotlin

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

private val pluginsPath = setOf(
    "sdk/cards",
    "sdk/core",
    "sdk/geofence",
    "sdk/inbox",
    "sdk/expo",
    "sdk/personalize"
)

/**
 * Returns all the plugins list
 */
fun getAllPluginsPath(): Set<String> = pluginsPath

private val pluginPackageNameAndPathMap = mapOf<String, String>(
    "cards" to "sdk/cards",
    "core" to "sdk/core",
    "geofence" to "sdk/geofence",
    "inbox" to "sdk/inbox",
    "expo" to "sdk/expo",
    "personalize" to "sdk/personalize"
)

fun getAllPluginPackageNameAndPaths(): Map<String, String> = pluginPackageNameAndPathMap
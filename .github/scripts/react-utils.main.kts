#!/usr/bin/env kotlin

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

private val pluginsPath = setOf(
    "sdk/cards",
    "sdk/core",
    "sdk/geofence",
    "sdk/inbox",
    "sdk/expo"
)

/**
 * Returns all the plugins list
 */
fun getAllPluginsPath(): Set<String> = pluginsPath
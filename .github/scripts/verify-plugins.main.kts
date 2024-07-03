#!/usr/bin/env kotlin

@file:Import("common-utils.main.kts")

import kotlin.system.exitProcess

val sampleAppDirectory = "sampleapp"
val androidAppDirectory = "android"

val workingDirectory = executeShellCommandWithStringOutput("pwd")

/**
 * Verify the react-native plugins
 * Verification:
 *  1. Install
 *  2. Testcases
 *  2. Tsc Configuration
 */
getAllPluginsPath().forEach { module ->
    println("Verifying: $module")
    val moduleDirectory = workingDirectory + module
    if (executeCommandOnShell(moduleDirectory, "npm install") != 0) {
        println("Npm Install Failed: $module")
        exitProcess(1)
    }

    if (executeCommandOnShell(moduleDirectory, "npm test") != 0) {
        println("Test Cases Failed: $module")
        exitProcess(1)
    }

    if (executeCommandOnShell(moduleDirectory, "tsc --noEmit") != 0) {
        println("Typescript Config Failed: $module")
        exitProcess(1)
    }
    println("Verified: $module")
}

/**
 * Verify the Android SampleApp
 */
println("Verifying: SampleApp/Android")
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", "npm install")
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", getInstallLocalCommand())
if (executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$androidAppDirectory", "./gradlew assemble") != 0) {
    println("Android Assemble Failed")
    exitProcess(1)
}
println("Verified: SampleApp/Android")
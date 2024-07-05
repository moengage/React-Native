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
    println("::group::Verifying: $module")
    val moduleDirectory = workingDirectory + module
    executeCommandOnShell(moduleDirectory, "npm install")

    if (executeCommandOnShell(moduleDirectory, "npm test") != 0) {
        println("::error::Test Cases Failed: $module")
        exitProcess(1)
    }

    if (executeCommandOnShell(moduleDirectory, "tsc --noEmit") != 0) {
        println("::error::Typescript Config Failed: $module")
//        exitProcess(1)
    }
    println("::notice::Verified: $module")
    println("::endgroup::")
}

// SampleApp Setup
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", "npm install")
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", getInstallLocalCommand())

/**
 * Verify the Android SampleApp
 */
println("::group::Verifying: SampleApp/Android")
if (executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$androidAppDirectory", "./gradlew assemble") != 0) {
    println("::error::Android Assemble Failed")
    exitProcess(1)
}
println("::notice::Verified: SampleApp/Android")
println("::endgroup::")
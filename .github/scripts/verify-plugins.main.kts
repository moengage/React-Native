
import java.io.File
#!/usr/bin/env kotlin

@file:Import("common-utils.main.kts")

import kotlin.system.exitProcess

val sampleAppDirectory = "SampleApp"
val androidAppDirectory = "android"
val iOSAppDirectory = "ios"

val workingDirectory = executeShellCommandWithStringOutput("pwd")
println(workingDirectory)

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

    println("::notice::Verified: $module")
    println("::endgroup::")
}

// SampleApp Setup
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", "npm install -g install-local")
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", "npm install")
executeCommandOnShell("$workingDirectory/$sampleAppDirectory", getInstallLocalCommand())
createLocalPropertiesFile("$workingDirectory/$sampleAppDirectory/$androidAppDirectory")

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

/**
 * Verify the iOS SampleApp
 */
 
println("::group::Verifying: SampleApp/iOS")

    // Attempt to install CocoaPods
    if (executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$iOSAppDirectory", "sudo gem install cocoapods") != 0) {
        println("::error::Failed to install CocoaPods")
        exitProcess(1)
    } else {
        println("::notice::CocoaPods installed successfully")
    }
    
    val podfileLock = File("$workingDirectory/$sampleAppDirectory/$iOSAppDirectory/Podfile.lock")

// Check if Podfile.lock exists and delete it if it does
if (podfileLock.exists()) {
    if (!podfileLock.delete()) {
        println("::error::Failed to delete Podfile.lock")
        exitProcess(1)
    }
}

// Update the pod repository
val updateRepoResult = executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$iOSAppDirectory", "pod repo update")
if (updateRepoResult != 0) {
    println("::error::Failed to update pod repo")
    exitProcess(1)
}

if (executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$iOSAppDirectory", "NO_FLIPPER=1 pod install") != 0) {
    println("::error::iOS Pod install Failed")
    exitProcess(1)
}

if (executeCommandOnShell("$workingDirectory/$sampleAppDirectory/$iOSAppDirectory",
    "xcodebuild -workspace SampleApp.xcworkspace " +
    "-scheme SampleApp " +
    "-sdk iphonesimulator") != 0) {
        exitProcess(1)
}
println("::notice::Verified: SampleApp/ios")
println("::endgroup::")


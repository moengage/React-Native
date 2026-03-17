#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20251224")
@file:Import("../scripts/react-utils.main.kts")

import java.io.File
import java.net.URL
import javax.xml.parsers.DocumentBuilderFactory
import org.w3c.dom.Element
import org.w3c.dom.NodeList
import org.xml.sax.InputSource
import java.io.StringReader
import org.json.JSONObject

// ── Configuration ──────────────────────────────────────────────────────────────

val MAVEN_BASE_URL = "https://repo1.maven.org/maven2/com/moengage"
val SONATYPE_SEARCH_URL = "https://central.sonatype.com/solrsearch/select"
val ANDROID_BOM_ARTIFACT = "android-bom"
val PLUGIN_BASE_BOM_ARTIFACT = "plugin-base-bom"
val MOENGAGE_GROUP = "com.moengage"

val ANDROID_BOM_VERSION_KEY = "moengageNativeBOMVersion"
val PLUGIN_BASE_BOM_VERSION_KEY = "moengagePluginBaseBOMVersion"

data class ModuleConfig(
    val gradleFilePath: String,
    val androidBomArtifacts: Set<String>,
    val pluginBaseBomArtifacts: Set<String>
)

val moduleConfigs = listOf(
    ModuleConfig(
        gradleFilePath = "sdk/core/android/moengage-dependency-helper.gradle",
        androidBomArtifacts = setOf(
            "moe-android-sdk", "inapp", "rich-notification", "security",
            "encrypted-storage", "push-amp", "hms-pushkit", "realtime-trigger"
        ),
        pluginBaseBomArtifacts = setOf("plugin-base")
    ),
    ModuleConfig(
        gradleFilePath = "sdk/inbox/android/build.gradle",
        androidBomArtifacts = setOf("moe-android-sdk", "inbox-core"),
        pluginBaseBomArtifacts = setOf("plugin-base-inbox")
    ),
    ModuleConfig(
        gradleFilePath = "sdk/cards/android/build.gradle",
        androidBomArtifacts = setOf("moe-android-sdk", "cards-core"),
        pluginBaseBomArtifacts = setOf("plugin-base-cards")
    ),
    ModuleConfig(
        gradleFilePath = "sdk/geofence/android/build.gradle",
        androidBomArtifacts = setOf("moe-android-sdk", "geofence"),
        pluginBaseBomArtifacts = setOf("plugin-base-geofence")
    )
)

// ── Fetch Latest Version from Maven Central ────────────────────────────────────

fun fetchLatestVersion(artifactId: String): String {
    val url = "$SONATYPE_SEARCH_URL?q=g:$MOENGAGE_GROUP+AND+a:$artifactId&core=gav&rows=1&wt=json&sort=version+desc"
    println("  Fetching latest version for $artifactId...")
    val response = URL(url).readText()

    val json = JSONObject(response)
    val docs = json.getJSONObject("response").getJSONArray("docs")
    if (docs.length() == 0) {
        error("No versions found for $MOENGAGE_GROUP:$artifactId on Maven Central")
    }

    val latestVersion = docs.getJSONObject(0).getString("v")
    println("  Latest version: $latestVersion")
    return latestVersion
}

// ── BOM POM Parsing ────────────────────────────────────────────────────────────

fun fetchBomDependencies(bomArtifact: String, bomVersion: String): Map<String, String> {
    val url = "$MAVEN_BASE_URL/$bomArtifact/$bomVersion/$bomArtifact-$bomVersion.pom"
    println("  Fetching: $url")
    val pomXml = URL(url).readText()

    val factory = DocumentBuilderFactory.newInstance()
    val builder = factory.newDocumentBuilder()
    val document = builder.parse(InputSource(StringReader(pomXml)))

    val dependencies = mutableMapOf<String, String>()
    val depNodes: NodeList = document.getElementsByTagName("dependency")
    for (i in 0 until depNodes.length) {
        val dep = depNodes.item(i) as Element
        val groupId = dep.getElementsByTagName("groupId").item(0)?.textContent ?: continue
        val artifactId = dep.getElementsByTagName("artifactId").item(0)?.textContent ?: continue
        val version = dep.getElementsByTagName("version").item(0)?.textContent ?: continue
        if (groupId == "com.moengage") {
            dependencies[artifactId] = version
        }
    }
    return dependencies
}

fun findChangedArtifacts(
    bomArtifact: String,
    oldVersion: String,
    newVersion: String
): Set<String> {
    if (oldVersion == newVersion) {
        println("  $bomArtifact version unchanged ($oldVersion), skipping.")
        return emptySet()
    }

    println("  Comparing $bomArtifact: $oldVersion -> $newVersion")
    val oldDeps = fetchBomDependencies(bomArtifact, oldVersion)
    val newDeps = fetchBomDependencies(bomArtifact, newVersion)

    val changed = mutableSetOf<String>()
    for ((artifact, newVer) in newDeps) {
        val oldVer = oldDeps[artifact]
        if (oldVer != newVer) {
            println("    Changed: $artifact ($oldVer -> $newVer)")
            changed.add(artifact)
        }
    }
    for (artifact in oldDeps.keys - newDeps.keys) {
        println("    Removed: $artifact")
        changed.add(artifact)
    }

    if (changed.isEmpty()) {
        println("    No artifact version changes detected.")
    }
    return changed
}

// ── Gradle File Update ─────────────────────────────────────────────────────────

fun readCurrentVersion(file: File, versionKey: String): String? {
    val regex = Regex("""$versionKey\s*=\s*"([^"]+)"""")
    for (line in file.readLines()) {
        val match = regex.find(line)
        if (match != null) return match.groupValues[1]
    }
    return null
}

fun updateVersionInFile(file: File, versionKey: String, oldVersion: String, newVersion: String) {
    val content = file.readText()
    val updated = content.replace(
        """$versionKey = "$oldVersion"""",
        """$versionKey = "$newVersion""""
    )
    file.writeText(updated)
}

// ── Main ───────────────────────────────────────────────────────────────────────

fun updateBom() {
    val projectRoot = File(".").canonicalFile
    println("Project root: $projectRoot")

    // Fetch latest versions from Maven Central
    println()
    println("Fetching latest BOM versions from Maven Central...")
    val newAndroidBomVersion = fetchLatestVersion(ANDROID_BOM_ARTIFACT)
    val newPluginBaseBomVersion = fetchLatestVersion(PLUGIN_BASE_BOM_ARTIFACT)

    println()
    println("Latest versions:")
    println("  android-bom: $newAndroidBomVersion")
    println("  plugin-base-bom: $newPluginBaseBomVersion")

    // Read current versions from the core module (source of truth)
    val coreGradleFile = File(projectRoot, moduleConfigs[0].gradleFilePath)
    val currentAndroidBomVersion = readCurrentVersion(coreGradleFile, ANDROID_BOM_VERSION_KEY)
        ?: error("Could not read current $ANDROID_BOM_VERSION_KEY from ${coreGradleFile.path}")
    val currentPluginBaseBomVersion = readCurrentVersion(coreGradleFile, PLUGIN_BASE_BOM_VERSION_KEY)
        ?: error("Could not read current $PLUGIN_BASE_BOM_VERSION_KEY from ${coreGradleFile.path}")

    println()
    println("Current versions:")
    println("  android-bom: $currentAndroidBomVersion")
    println("  plugin-base-bom: $currentPluginBaseBomVersion")
    println()

    // Find changed artifacts in each BOM
    println("Analyzing android-bom changes...")
    val androidBomChanged = findChangedArtifacts(
        ANDROID_BOM_ARTIFACT, currentAndroidBomVersion, newAndroidBomVersion
    )

    println()
    println("Analyzing plugin-base-bom changes...")
    val pluginBaseBomChanged = findChangedArtifacts(
        PLUGIN_BASE_BOM_ARTIFACT, currentPluginBaseBomVersion, newPluginBaseBomVersion
    )

    println()
    println("Updating modules...")

    for (config in moduleConfigs) {
        val file = File(projectRoot, config.gradleFilePath)
        if (!file.exists()) {
            println("  WARN: ${config.gradleFilePath} not found, skipping.")
            continue
        }

        val shouldUpdateAndroidBom = currentAndroidBomVersion != newAndroidBomVersion
            && config.androidBomArtifacts.any { it in androidBomChanged }

        val shouldUpdatePluginBaseBom = currentPluginBaseBomVersion != newPluginBaseBomVersion
            && config.pluginBaseBomArtifacts.any { it in pluginBaseBomChanged }

        if (!shouldUpdateAndroidBom && !shouldUpdatePluginBaseBom) {
            println("  SKIP: ${config.gradleFilePath} -- no relevant artifact changes")
            continue
        }

        if (shouldUpdateAndroidBom) {
            updateVersionInFile(file, ANDROID_BOM_VERSION_KEY, currentAndroidBomVersion, newAndroidBomVersion)
            println("  UPDATED: ${config.gradleFilePath} -- $ANDROID_BOM_VERSION_KEY: $currentAndroidBomVersion -> $newAndroidBomVersion")
        }

        if (shouldUpdatePluginBaseBom) {
            updateVersionInFile(file, PLUGIN_BASE_BOM_VERSION_KEY, currentPluginBaseBomVersion, newPluginBaseBomVersion)
            println("  UPDATED: ${config.gradleFilePath} -- $PLUGIN_BASE_BOM_VERSION_KEY: $currentPluginBaseBomVersion -> $newPluginBaseBomVersion")
        }
    }

    println()
    println("Done.")
}

// ── Entry Point ────────────────────────────────────────────────────────────────

updateBom()

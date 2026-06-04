#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20251224")

import java.io.File
import java.util.Base64
import org.json.JSONObject

// ── Configuration ──────────────────────────────────────────────────────────────

val MOENGAGE_OWNER = "moengage"
val PLUGINBASE_REPO = "iOS-PluginBase"

data class PodConfig(
    val podName: String,
    val pluginRepo: String,
    val podspecPath: String,
    val changelogPath: String
)

val podConfigs = listOf(
    PodConfig("MoEngagePluginBase",        "iOS-PluginBase",           "sdk/core/ReactNativeMoEngage.podspec",                   "sdk/core/CHANGELOG.md"),
    PodConfig("MoEngagePluginInbox",       "apple-plugin-inbox",       "sdk/inbox/ReactNativeMoEngageInbox.podspec",             "sdk/inbox/CHANGELOG.md"),
    PodConfig("MoEngagePluginCards",       "apple-plugin-cards",       "sdk/cards/ReactNativeMoEngageCards.podspec",             "sdk/cards/CHANGELOG.md"),
    PodConfig("MoEngagePluginGeofence",    "apple-plugin-geofence",    "sdk/geofence/ReactNativeMoEngageGeofence.podspec",       "sdk/geofence/CHANGELOG.md"),
    PodConfig("MoEngagePluginPersonalize", "apple-plugin-personalize", "sdk/personalize/ReactNativeMoEngagePersonalize.podspec", "sdk/personalize/CHANGELOG.md")
)

// ── GitHub API: fetch upstream package.json ────────────────────────────────────

fun fetchUpstreamPackageJson(repo: String): JSONObject {
    val process = ProcessBuilder(
        "gh", "api",
        "-H", "Accept: application/vnd.github+json",
        "repos/$MOENGAGE_OWNER/$repo/contents/package.json"
    ).redirectErrorStream(true).start()
    val output = process.inputStream.bufferedReader().readText()
    val exit = process.waitFor()
    if (exit != 0) error("gh api failed for $repo: $output")
    val response = JSONObject(output)
    val encoded = response.getString("content").replace("\n", "").replace(" ", "")
    val decoded = String(Base64.getDecoder().decode(encoded))
    return JSONObject(decoded)
}

fun fetchLatestPodVersion(repo: String): String {
    val pkg = fetchUpstreamPackageJson(repo)
    return pkg.getJSONArray("packages").getJSONObject(0).getString("version")
}

fun fetchPluginBaseSdkVerMin(): String? {
    return try {
        fetchUpstreamPackageJson(PLUGINBASE_REPO).optString("sdkVerMin").ifEmpty { null }
    } catch (e: Exception) {
        println("  WARN: failed to read sdkVerMin from $PLUGINBASE_REPO: ${e.message}")
        null
    }
}

// ── Podspec edits ──────────────────────────────────────────────────────────────

fun podDependencyRegex(podName: String): Regex {
    // Matches: s.dependency '<podName>','X.Y.Z'  OR  "...",'...'  OR  '...', "..."  etc.
    val name = Regex.escape(podName)
    return Regex("""s\.dependency\s+["']$name["']\s*,\s*["']([^"']+)["']""")
}

fun readCurrentPodVersion(file: File, podName: String): String? {
    val match = podDependencyRegex(podName).find(file.readText()) ?: return null
    return match.groupValues[1]
}

fun updatePodspecVersion(file: File, podName: String, oldVersion: String, newVersion: String) {
    val content = file.readText()
    val regex = podDependencyRegex(podName)
    val match = regex.find(content) ?: error("Pod dependency line not found for $podName in ${file.path}")
    val oldLine = match.value
    val newLine = oldLine.replace("\"$oldVersion\"", "\"$newVersion\"").replace("'$oldVersion'", "'$newVersion'")
    file.writeText(content.replace(oldLine, newLine))
}

// ── Changelog edits (translated from update-bom.main.kts) ──────────────────────

fun appendIosChangelogEntries(file: File, lines: List<String>) {
    if (lines.isEmpty()) return
    val fileLines = file.readLines().toMutableList()
    val iosSectionRegex = Regex("""^- iOS$""")
    val datedEntryRegex = Regex("""^# \d{2}-\d{2}-\d{4}$""")

    val firstDatedEntry = fileLines.indexOfFirst { datedEntryRegex.matches(it) }

    // If the file starts with a dated entry, there is no unreleased section. Prepend one
    // so we never pollute a released entry.
    if (firstDatedEntry == 0) {
        val unreleased = mutableListOf("# Release Date", "", "## Release Version", "", "- iOS")
        unreleased.addAll(lines)
        unreleased.add("")
        fileLines.addAll(0, unreleased)
        file.writeText(fileLines.joinToString("\n") + "\n")
        return
    }

    val searchEnd = if (firstDatedEntry > 0) firstDatedEntry else fileLines.size
    val iosIndex = fileLines.subList(0, searchEnd).indexOfFirst { iosSectionRegex.matches(it) }
    val insertAt: Int
    if (iosIndex >= 0) {
        // Insert after the iOS heading (and any existing iOS sub-bullets, before next top-level heading)
        var cursor = iosIndex + 1
        while (cursor < searchEnd && fileLines[cursor].startsWith("  ")) cursor++
        insertAt = cursor
    } else {
        val tail = if (firstDatedEntry > 0) firstDatedEntry else fileLines.size
        fileLines.add(tail, "- iOS")
        insertAt = tail + 1
    }
    fileLines.addAll(insertAt, lines)
    file.writeText(fileLines.joinToString("\n") + "\n")
}

// ── Main ───────────────────────────────────────────────────────────────────────

fun updateIos() {
    if (System.getenv("GH_TOKEN").isNullOrEmpty() && System.getenv("GITHUB_TOKEN").isNullOrEmpty()) {
        error("GH_TOKEN (or GITHUB_TOKEN) env var required to call gh api")
    }
    val projectRoot = File(".").canonicalFile
    println("Project root: $projectRoot")
    println()
    println("Fetching latest plugin versions from upstream package.json files...")

    data class ResolvedUpdate(val config: PodConfig, val oldVersion: String, val newVersion: String)
    val updates = mutableListOf<ResolvedUpdate>()
    var pluginBaseBumped = false

    for (config in podConfigs) {
        val podspec = File(projectRoot, config.podspecPath)
        if (!podspec.exists()) {
            println("  WARN: ${config.podspecPath} not found, skipping.")
            continue
        }
        val current = readCurrentPodVersion(podspec, config.podName)
        if (current == null) {
            println("  WARN: could not find ${config.podName} dependency in ${config.podspecPath}; skipping.")
            continue
        }

        val latest = try {
            fetchLatestPodVersion(config.pluginRepo)
        } catch (e: Exception) {
            println("  WARN: could not fetch latest for ${config.podName} from ${config.pluginRepo}: ${e.message}")
            continue
        }

        if (current == latest) {
            println("  SKIP: ${config.podName} already at $current")
        } else {
            println("  BUMP: ${config.podName} $current -> $latest")
            updates.add(ResolvedUpdate(config, current, latest))
            updatePodspecVersion(podspec, config.podName, current, latest)
            if (config.podName == "MoEngagePluginBase") pluginBaseBumped = true
        }
    }

    if (updates.isEmpty()) {
        println()
        println("No updates to apply.")
        return
    }

    println()
    println("Updating CHANGELOGs...")
    val sdkVerMin = if (pluginBaseBumped) fetchPluginBaseSdkVerMin() else null
    for (u in updates) {
        val changelog = File(projectRoot, u.config.changelogPath)
        if (!changelog.exists()) {
            println("  WARN: ${u.config.changelogPath} not found, skipping changelog update.")
            continue
        }
        val lines = mutableListOf<String>()
        lines.add("  - [minor] updating `${u.config.podName}` to `${u.newVersion}`")
        if (u.config.podName == "MoEngagePluginBase" && sdkVerMin != null) {
            lines.add("  - [minor] updating `MoEngage-iOS-SDK` to `$sdkVerMin`")
        }
        appendIosChangelogEntries(changelog, lines)
        println("  UPDATED: ${u.config.changelogPath}")
    }

    println()
    println("Done. ${updates.size} pod(s) bumped.")
}

updateIos()

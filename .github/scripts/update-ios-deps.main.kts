#!/usr/bin/env kotlin

@file:DependsOn("org.json:json:20251224")

import java.io.File
import java.util.Base64
import org.json.JSONObject

// ── Configuration ──────────────────────────────────────────────────────────────

val MOENGAGE_OWNER = "moengage"
val PLUGINBASE_REPO = "iOS-PluginBase"
val BUMP_SUMMARY_FILE = ".github/scripts/.bump-summary.txt"

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

// ── Changelog edits ────────────────────────────────────────────────────────────

// Anchor on the explicit "# Release Date" unreleased marker (the convention already in use).
// This avoids trying to detect where released content STARTS via regex — that approach was
// fragile against trailing whitespace on dated headings and other formatting quirks.

val RELEASE_DATE_MARKER = "# Release Date"

// Extract artifact name (e.g. "MoEngagePluginBase") from a bullet like
//   "  - [minor] updating `MoEngagePluginBase` to `6.10.0`"
// so a subsequent run can UPDATE the existing bullet rather than duplicating it.
val ARTIFACT_LINE_REGEX = Regex("""updating\s+`([^`]+)`\s+to\s+`[^`]+`""")

fun artifactMatcher(bullet: String): Regex? {
    val m = ARTIFACT_LINE_REGEX.find(bullet) ?: return null
    val artifact = Regex.escape(m.groupValues[1])
    return Regex("""updating\s+`$artifact`\s+to\s+`[^`]+`""")
}

fun appendIosChangelogEntries(file: File, bullets: List<String>) {
    if (bullets.isEmpty()) return
    val fileLines = file.readLines().toMutableList()

    val hasUnreleasedSection = fileLines.isNotEmpty() && fileLines[0].trim() == RELEASE_DATE_MARKER

    if (!hasUnreleasedSection) {
        // No unreleased section — prepend a fresh one with the platform heading and bullets.
        val prefix = mutableListOf("# Release Date", "", "## Release Version", "", "- iOS")
        prefix.addAll(bullets)
        prefix.add("")
        fileLines.addAll(0, prefix)
        file.writeText(fileLines.joinToString("\n") + "\n")
        return
    }

    // Unreleased section exists. Its end is the next top-level "# ..." heading — whatever
    // format it uses (dated, annotated, trailing whitespace — irrelevant). We never
    // touch anything past this boundary.
    val unreleasedEnd = (1 until fileLines.size)
        .firstOrNull { fileLines[it].startsWith("# ") }
        ?: fileLines.size

    // For each new bullet: if an existing bullet for the same artifact is present in the
    // unreleased section, REPLACE it (so re-runs update in place instead of duplicating).
    // Otherwise queue it for insertion under the "- iOS" heading.
    val remaining = mutableListOf<String>()
    for (bullet in bullets) {
        val matcher = artifactMatcher(bullet)
        var replaced = false
        if (matcher != null) {
            for (i in 0 until unreleasedEnd) {
                if (matcher.containsMatchIn(fileLines[i])) {
                    fileLines[i] = bullet
                    replaced = true
                    break
                }
            }
        }
        if (!replaced) remaining.add(bullet)
    }
    if (remaining.isEmpty()) {
        file.writeText(fileLines.joinToString("\n") + "\n")
        return
    }

    // Find or create the "- iOS" heading inside the unreleased section, then insert
    // after its existing sub-bullets.
    val iosIndex = fileLines.subList(0, unreleasedEnd).indexOfFirst { it == "- iOS" }
    val insertAt: Int
    if (iosIndex >= 0) {
        var cursor = iosIndex + 1
        while (cursor < unreleasedEnd && fileLines[cursor].startsWith("  ")) cursor++
        insertAt = cursor
    } else {
        fileLines.add(unreleasedEnd, "- iOS")
        insertAt = unreleasedEnd + 1
    }
    fileLines.addAll(insertAt, remaining)
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
    val summaryFile = File(projectRoot, BUMP_SUMMARY_FILE)
    summaryFile.parentFile?.mkdirs()
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
        summaryFile.appendText("- iOS: `${u.config.podName}` ${u.oldVersion} → ${u.newVersion}\n")
    }
    if (pluginBaseBumped && sdkVerMin != null) {
        summaryFile.appendText("- iOS: `MoEngage-iOS-SDK` → $sdkVerMin\n")
    }

    println()
    println("Done. ${updates.size} pod(s) bumped.")
}

updateIos()

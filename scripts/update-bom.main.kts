import kotlin.system.exitProcess

val script = "../sdk-automation-scripts/scripts/hybrid/react-native-version-update.main.kts"
val repoPath = "."

val cmd = "kotlin $script \"$repoPath\" ${args.joinToString(" ") { "\"$it\"" }}"
val process = ProcessBuilder("/bin/bash", "-c", cmd).inheritIO().start()
exitProcess(process.waitFor())
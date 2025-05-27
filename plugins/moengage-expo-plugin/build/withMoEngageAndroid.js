"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMoEngageAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
const withMoEngageAndroid = (config, props) => {
    var _a, _b, _c, _d;
    // Add MoEngage SDK initialization to MainApplication
    config = (0, config_plugins_1.withMainApplication)(config, (config) => {
        var _a, _b;
        const { modResults } = config;
        // Check if custom initialization config is provided
        const useCustomConfig = ((_a = props.android) === null || _a === void 0 ? void 0 : _a.configFilePath) !== undefined;
        const configFilePath = ((_b = props.android) === null || _b === void 0 ? void 0 : _b.configFilePath) || "assets/moengage/android_initilisation_config.xml";
        if (!modResults.contents.includes('MoEngage.Builder')) {
            // Add import statements
            const importRegex = /import com\.facebook\.react\.ReactApplication;/g;
            const moengageImports = `import com.facebook.react.ReactApplication;
import com.moengage.core.MoEngage;
import com.moengage.core.LogLevel;
import com.moengage.core.config.MoEInitConfig;
import com.moengage.core.config.NotificationConfig;
import com.moengage.react.MoEInitializer;`;
            modResults.contents = modResults.contents.replace(importRegex, moengageImports);
            // Add MoEngage initialization code
            const createReactContextRegex = /(public void onCreate\\(\\) \\{[\\s\\S]*?super\\.onCreate\\(\\);)/g;
            // Generate initialization code based on configuration
            let moengageInitCode;
            if (useCustomConfig) {
                // Use custom XML configuration
                moengageInitCode = `$1
    
    // Initialize MoEngage with custom config
    MoEInitializer.initializeDefaultInstance(this, "${configFilePath}");`;
            }
            else {
                // Use programmatic configuration with default settings
                // App ID will be taken from the config file or other mechanisms
                moengageInitCode = `$1
    
    // Initialize MoEngage with default settings
    MoEInitConfig moEInitConfig = new MoEInitConfig.Builder(null, MoEngage.PUSH_FCM)
        .configureLogs(LogLevel.NONE)
        .configureNotificationMetaData(new NotificationConfig(R.mipmap.ic_launcher, R.mipmap.ic_launcher))
        .build();
    MoEInitializer.initializeDefaultInstance(this, moEInitConfig);`;
            }
            modResults.contents = modResults.contents.replace(createReactContextRegex, moengageInitCode);
        }
        return config;
    });
    // Update Android Manifest with required permissions
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        // No longer adding app ID as meta-data since it's not part of the contract
        return config;
    });
    // Configure notification icons if provided
    if (((_a = props.android) === null || _a === void 0 ? void 0 : _a.smallIconPath) || ((_b = props.android) === null || _b === void 0 ? void 0 : _b.largeIconPath)) {
        config = (0, config_plugins_1.withDangerousMod)(config, ['android', (config) => __awaiter(void 0, void 0, void 0, function* () {
                var _e, _f, _g, _h, _j, _k, _l, _m;
                const projectRoot = config.modRequest.projectRoot;
                const stringsXmlPath = path_1.default.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
                if (fs_1.default.existsSync(stringsXmlPath)) {
                    let stringsContent = fs_1.default.readFileSync(stringsXmlPath, 'utf8');
                    const resourcesEndTag = '</resources>';
                    let newEntries = '';
                    // Add small icon entry if needed
                    if ((_e = props.android) === null || _e === void 0 ? void 0 : _e.smallIconPath) {
                        const smallIconName = getResourceNameFromPath((_f = props.android) === null || _f === void 0 ? void 0 : _f.smallIconPath);
                        newEntries += `    <string name="moe_push_small_icon">${smallIconName}</string>\n`;
                    }
                    // Add large icon entry if needed
                    if ((_g = props.android) === null || _g === void 0 ? void 0 : _g.largeIconPath) {
                        const largeIconName = getResourceNameFromPath((_h = props.android) === null || _h === void 0 ? void 0 : _h.largeIconPath);
                        newEntries += `    <string name="moe_push_large_icon">${largeIconName}</string>\n`;
                    }
                    // Insert new entries before </resources> closing tag
                    if (newEntries) {
                        stringsContent = stringsContent.replace(resourcesEndTag, `${newEntries}${resourcesEndTag}`);
                        fs_1.default.writeFileSync(stringsXmlPath, stringsContent, 'utf8');
                    }
                }
                else {
                    // If strings.xml doesn't exist, create it with our entries
                    const stringsDir = path_1.default.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'values');
                    if (!fs_1.default.existsSync(stringsDir)) {
                        fs_1.default.mkdirSync(stringsDir, { recursive: true });
                    }
                    let stringsContent = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
                    // Add small icon entry if needed
                    if ((_j = props.android) === null || _j === void 0 ? void 0 : _j.smallIconPath) {
                        const smallIconName = getResourceNameFromPath((_k = props.android) === null || _k === void 0 ? void 0 : _k.smallIconPath);
                        stringsContent += `    <string name="moe_push_small_icon">${smallIconName}</string>\n`;
                    }
                    // Add large icon entry if needed
                    if ((_l = props.android) === null || _l === void 0 ? void 0 : _l.largeIconPath) {
                        const largeIconName = getResourceNameFromPath((_m = props.android) === null || _m === void 0 ? void 0 : _m.largeIconPath);
                        stringsContent += `    <string name="moe_push_large_icon">${largeIconName}</string>\n`;
                    }
                    stringsContent += '</resources>\n';
                    fs_1.default.writeFileSync(stringsXmlPath, stringsContent, 'utf8');
                }
                return config;
            })]);
    }
    // Add MoEngage dependencies to build.gradle files
    config = (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (!config.modResults.contents.includes("implementation 'com.moengage:react-native-moengage")) {
            // Add MoEngage dependencies
            const depImplementationRegex = /dependencies\s*\{\s/g;
            const moenageDependencies = `dependencies {
    // MoEngage dependencies
    implementation 'com.moengage:react-native-moengage:10.11.0'
    implementation 'com.moengage:react-native-moengage-cards:3.1.0'
    `;
            config.modResults.contents = config.modResults.contents.replace(depImplementationRegex, moenageDependencies);
        }
        return config;
    });
    // Add required repositories to project-level build.gradle
    config = (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (!config.modResults.contents.includes('maven { url "https://moengage.bintray.com/moengage-android-sdk" }')) {
            // Add MoEngage maven repository
            const allProjectsRegex = /allprojects\s*\{[\s\S]*?repositories\s*\{/g;
            const moengageMavenRepo = `allprojects {
    repositories {
        maven { url "https://moengage.bintray.com/moengage-android-sdk" }`;
            config.modResults.contents = config.modResults.contents.replace(allProjectsRegex, moengageMavenRepo);
        }
        return config;
    });
    // Configure backup rules if disableMoEngageDefaultBackupFile is true
    if ((_c = props.android) === null || _c === void 0 ? void 0 : _c.disableMoEngageDefaultBackupFile) {
        config = (0, config_plugins_1.withDangerousMod)(config, ['android', (config) => __awaiter(void 0, void 0, void 0, function* () {
                const projectRoot = config.modRequest.projectRoot;
                const androidPath = path_1.default.join(projectRoot, 'android');
                // Create custom backup rules XML
                const backupRulesPath = path_1.default.join(androidPath, 'app', 'src', 'main', 'res', 'xml');
                const backupRulesFile = path_1.default.join(backupRulesPath, 'moe_backup_rules.xml');
                // Make sure directory exists
                if (!fs_1.default.existsSync(backupRulesPath)) {
                    fs_1.default.mkdirSync(backupRulesPath, { recursive: true });
                }
                // Create backup rules file
                const backupRulesContent = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="MoEngage.xml"/>
    <exclude domain="database" path="MoeDatabase"/>
    <exclude domain="database" path="MoeDatabase-journal"/>
    <exclude domain="file" path="moe_persistent_dir"/>
</full-backup-content>`;
                fs_1.default.writeFileSync(backupRulesFile, backupRulesContent);
                // Update AndroidManifest.xml in a separate step
                const androidManifestPath = path_1.default.join(androidPath, 'app', 'src', 'main', 'AndroidManifest.xml');
                if (fs_1.default.existsSync(androidManifestPath)) {
                    try {
                        const xmlContent = fs_1.default.readFileSync(androidManifestPath, 'utf8');
                        const updatedXml = xmlContent.replace(/<application/, '<application android:fullBackupContent="@xml/moe_backup_rules"');
                        fs_1.default.writeFileSync(androidManifestPath, updatedXml, 'utf8');
                    }
                    catch (error) {
                        console.warn('Failed to update AndroidManifest.xml with backup rules:', error);
                    }
                }
                return config;
            })]);
    }
    // Copy custom initialization config file if specified
    if ((_d = props.android) === null || _d === void 0 ? void 0 : _d.configFilePath) {
        config = (0, config_plugins_1.withDangerousMod)(config, ['android', (config) => __awaiter(void 0, void 0, void 0, function* () {
                var _o;
                const projectRoot = config.modRequest.projectRoot;
                const sourcePath = path_1.default.join(projectRoot, ((_o = props.android) === null || _o === void 0 ? void 0 : _o.configFilePath) || "");
                if (fs_1.default.existsSync(sourcePath)) {
                    const androidAssetsPath = path_1.default.join(projectRoot, 'android', 'app', 'src', 'main', 'assets', 'moengage');
                    // Create directory if it doesn't exist
                    if (!fs_1.default.existsSync(androidAssetsPath)) {
                        fs_1.default.mkdirSync(androidAssetsPath, { recursive: true });
                    }
                    // Copy the configuration file
                    const destPath = path_1.default.join(androidAssetsPath, 'android_initilisation_config.xml');
                    fs_1.default.copyFileSync(sourcePath, destPath);
                }
                else {
                    console.warn(`MoEngage config file not found at: ${sourcePath}`);
                }
                return config;
            })]);
    }
    return config;
};
exports.withMoEngageAndroid = withMoEngageAndroid;
// Helper function to extract resource name from file path
function getResourceNameFromPath(filePath) {
    // Extract filename without extension
    const filename = path_1.default.basename(filePath, path_1.default.extname(filePath));
    return filename;
}

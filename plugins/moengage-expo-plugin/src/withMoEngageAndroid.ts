import {
  ConfigPlugin,
  withMainApplication,
  withAppBuildGradle,
  withProjectBuildGradle,
  withAndroidManifest,
  AndroidConfig,
  withDangerousMod
} from '@expo/config-plugins';
import { MoEngagePluginProps } from '.';
import fs from 'fs';
import path from 'path';

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } = AndroidConfig.Manifest;

export const withMoEngageAndroid: ConfigPlugin<MoEngagePluginProps> = (config, props) => {
  // Add MoEngage SDK initialization to MainApplication
  config = withMainApplication(config, (config) => {
    const { modResults } = config;
    
    // Check if custom initialization config is provided
    const useCustomConfig = props.android?.configFilePath !== undefined;
    const configFilePath = props.android?.configFilePath || "assets/moengage/android_initilisation_config.xml";
    
    if (!modResults.contents.includes('MoEngage.Builder')) {
      // Add import statements
      const importRegex = /import com\.facebook\.react\.ReactApplication;/g;
      const moengageImports = `import com.facebook.react.ReactApplication;
import com.moengage.core.MoEngage;
import com.moengage.core.LogLevel;
import com.moengage.core.config.MoEInitConfig;
import com.moengage.core.config.NotificationConfig;
import com.moengage.react.MoEInitializer;`;
      
      modResults.contents = modResults.contents.replace(
        importRegex,
        moengageImports
      );

      // Add MoEngage initialization code
      const createReactContextRegex = /(public void onCreate\\(\\) \\{[\\s\\S]*?super\\.onCreate\\(\\);)/g;
      
      // Generate initialization code based on configuration
      let moengageInitCode;
      if (useCustomConfig) {
        // Use custom XML configuration
        moengageInitCode = `$1
    
    // Initialize MoEngage with custom config
    MoEInitializer.initializeDefaultInstance(this, "${configFilePath}");`;
      } else {
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
      
      modResults.contents = modResults.contents.replace(
        createReactContextRegex,
        moengageInitCode
      );
    }
    
    return config;
  });

  // Update Android Manifest with required permissions
  config = withAndroidManifest(config, (config) => {
    // No longer adding app ID as meta-data since it's not part of the contract
    return config;
  });

  // Configure notification icons if provided
  if (props.android?.smallIconPath || props.android?.largeIconPath) {
    config = withDangerousMod(config, ['android', async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const stringsXmlPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
      
      if (fs.existsSync(stringsXmlPath)) {
        let stringsContent = fs.readFileSync(stringsXmlPath, 'utf8');
        const resourcesEndTag = '</resources>';
        let newEntries = '';
        
        // Add small icon entry if needed
        if (props.android?.smallIconPath) {
          const smallIconName = getResourceNameFromPath(props.android?.smallIconPath);
          newEntries += `    <string name="moe_push_small_icon">${smallIconName}</string>\n`;
        }
        
        // Add large icon entry if needed
        if (props.android?.largeIconPath) {
          const largeIconName = getResourceNameFromPath(props.android?.largeIconPath);
          newEntries += `    <string name="moe_push_large_icon">${largeIconName}</string>\n`;
        }
        
        // Insert new entries before </resources> closing tag
        if (newEntries) {
          stringsContent = stringsContent.replace(resourcesEndTag, `${newEntries}${resourcesEndTag}`);
          fs.writeFileSync(stringsXmlPath, stringsContent, 'utf8');
        }
      } else {
        // If strings.xml doesn't exist, create it with our entries
        const stringsDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res', 'values');
        if (!fs.existsSync(stringsDir)) {
          fs.mkdirSync(stringsDir, { recursive: true });
        }
        
        let stringsContent = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
        
        // Add small icon entry if needed
        if (props.android?.smallIconPath) {
          const smallIconName = getResourceNameFromPath(props.android?.smallIconPath);
          stringsContent += `    <string name="moe_push_small_icon">${smallIconName}</string>\n`;
        }
        
        // Add large icon entry if needed
        if (props.android?.largeIconPath) {
          const largeIconName = getResourceNameFromPath(props.android?.largeIconPath);
          stringsContent += `    <string name="moe_push_large_icon">${largeIconName}</string>\n`;
        }
        
        stringsContent += '</resources>\n';
        fs.writeFileSync(stringsXmlPath, stringsContent, 'utf8');
      }
      
      return config;
    }]);
  }

  // Add MoEngage dependencies to build.gradle files
  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes("implementation 'com.moengage:react-native-moengage")) {
      // Add MoEngage dependencies
      const depImplementationRegex = /dependencies\s*\{\s/g;
      const moenageDependencies = `dependencies {
    // MoEngage dependencies
    implementation 'com.moengage:react-native-moengage:10.11.0'
    implementation 'com.moengage:react-native-moengage-cards:3.1.0'
    `;
      
      config.modResults.contents = config.modResults.contents.replace(
        depImplementationRegex,
        moenageDependencies
      );
    }
    
    return config;
  });

  // Add required repositories to project-level build.gradle
  config = withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('maven { url "https://moengage.bintray.com/moengage-android-sdk" }')) {
      // Add MoEngage maven repository
      const allProjectsRegex = /allprojects\s*\{[\s\S]*?repositories\s*\{/g;
      const moengageMavenRepo = `allprojects {
    repositories {
        maven { url "https://moengage.bintray.com/moengage-android-sdk" }`;
      
      config.modResults.contents = config.modResults.contents.replace(
        allProjectsRegex,
        moengageMavenRepo
      );
    }
    
    return config;
  });

  // Configure backup rules if disableMoEngageDefaultBackupFile is true
  if (props.android?.disableMoEngageDefaultBackupFile) {
    config = withDangerousMod(config, ['android', async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidPath = path.join(projectRoot, 'android');

      // Create custom backup rules XML
      const backupRulesPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'xml');
      const backupRulesFile = path.join(backupRulesPath, 'moe_backup_rules.xml');

      // Make sure directory exists
      if (!fs.existsSync(backupRulesPath)) {
        fs.mkdirSync(backupRulesPath, { recursive: true });
      }

      // Create backup rules file
      const backupRulesContent = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="MoEngage.xml"/>
    <exclude domain="database" path="MoeDatabase"/>
    <exclude domain="database" path="MoeDatabase-journal"/>
    <exclude domain="file" path="moe_persistent_dir"/>
</full-backup-content>`;

      fs.writeFileSync(backupRulesFile, backupRulesContent);

      // Update AndroidManifest.xml in a separate step
      const androidManifestPath = path.join(androidPath, 'app', 'src', 'main', 'AndroidManifest.xml');
      if (fs.existsSync(androidManifestPath)) {
        try {
          const xmlContent = fs.readFileSync(androidManifestPath, 'utf8');
          const updatedXml = xmlContent.replace(
            /<application/,
            '<application android:fullBackupContent="@xml/moe_backup_rules"'
          );
          fs.writeFileSync(androidManifestPath, updatedXml, 'utf8');
        } catch (error) {
          console.warn('Failed to update AndroidManifest.xml with backup rules:', error);
        }
      }

      return config;
    }]);
  }

  // Copy custom initialization config file if specified
  if (props.android?.configFilePath) {
    config = withDangerousMod(config, ['android', async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const sourcePath = path.join(projectRoot, props.android?.configFilePath || "");
      
      if (fs.existsSync(sourcePath)) {
        const androidAssetsPath = path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets', 'moengage');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(androidAssetsPath)) {
          fs.mkdirSync(androidAssetsPath, { recursive: true });
        }
        
        // Copy the configuration file
        const destPath = path.join(androidAssetsPath, 'android_initilisation_config.xml');
        fs.copyFileSync(sourcePath, destPath);
      } else {
        console.warn(`MoEngage config file not found at: ${sourcePath}`);
      }

      return config;
    }]);
  }

  return config;
};

// Helper function to extract resource name from file path
function getResourceNameFromPath(filePath: string): string {
  // Extract filename without extension
  const filename = path.basename(filePath, path.extname(filePath));
  return filename;
}
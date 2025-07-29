import { ManifestApplication } from "@expo/config-plugins/build/android/Manifest";
import fs from 'node:fs';
import path from 'node:path';

/**
 * Add serviceEntry to the main application manifest if does not already exist.
 */
export function addServiceToManifestIfNotExist(
    mainApplication: ManifestApplication,
    serviceEntry: any,
    serviceName: string
): ManifestApplication {
    console.log('Checking if service exists:', serviceName);
    if (!isServiceExistInManifest(mainApplication, serviceName)) {
        console.log('Adding service to manifest:', serviceName);
        addServiceToManifest(mainApplication, serviceEntry);
    }
    return mainApplication;
}

/**
 * Return true if given serviceName already exists in the main application manifest, else false.
 */
export function isServiceExistInManifest(mainApplication: ManifestApplication, serviceName: string): boolean {
    const isServiceExist = (mainApplication.service || []).find(
        (service: any) => service.$ && service.$['android:name'] === serviceName
    );
    console.log('Service exists:', serviceName, isServiceExist !== undefined);
    return isServiceExist !== undefined;
}

/**
 * Add serviceEntry to the main application manifest.
 */
export function addServiceToManifest(mainApplication: ManifestApplication, serviceEntry: any) {
    console.log('Adding service entry:', serviceEntry);
    if (!mainApplication.service) {
        mainApplication.service = [];
    }
    mainApplication.service.push(serviceEntry);
}

/**
 * Copy file from src to dest after creating dest directory if not exist
 */
export async function copyFile(src: string, dest: string) {
  let destPath = dest;
  if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
    destPath = path.join(dest, path.basename(src));
  }
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  console.log('Copying file from', src, 'to', destPath);
  fs.copyFileSync(src, destPath);
}

/**
 * Add a dependency to the dependencies block in app/build.gradle if not already present.
 */
export function addDependencyToGradle(contents: string, group: string, module: string, version: string): string {
  const dependency = `implementation("${group}:${module}:${version}")`;
  console.log('Checking for dependency:', group, module, version);
  if (!contents.includes(`${group}:${module}`)) {
    console.log('Adding dependency:', dependency);
    return contents.replace(
      /dependencies\s*\{/,
      match => `${match}\n    ${dependency}`
    );
  }
  console.log('Dependency already present:', dependency);
  return contents;
}

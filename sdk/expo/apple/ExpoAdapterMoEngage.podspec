require 'json'
package = JSON.parse(File.read(File.join(__dir__, '../package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoAdapterMoEngage'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = "https://www.moengage.com"
  s.platforms = { :ios => "13.0", :tvos => "13.0" }
  s.swift_version  = '5.0'
  s.source         = { git: package['repository']['url'] }
  s.static_framework = true

  s.source_files = "ExpoAdapterMoEngage/**/*.{h,m,swift}"

  s.dependency 'ExpoModulesCore'
  s.dependency 'ReactNativeMoEngage'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  version_file = "#{s.name}/MoEngageExpoPluginInfo+Version.swift"
  s.prepare_command = <<-CMD
    echo // Generated file, do not edit > #{version_file}
    echo "import Foundation\n" >> #{version_file}
    echo "extension MoEngageExpoPluginInfo {\n    static let moduleVersion = \\"#{s.version}\\"\n}" >> #{version_file}
  CMD

  if !$ExpoUseSources&.include?(package['name']) && ENV['EXPO_USE_SOURCE'].to_i == 0 && File.exist?("#{s.name}.xcframework") && Gem::Version.new(Pod::VERSION) >= Gem::Version.new('1.10.0')
    s.source_files = "#{s.name}/**/*.h"
    s.vendored_frameworks = "#{s.name}.xcframework"
  else
    s.source_files = "#{s.name}/**/*.{h,m,swift}"
  end
end
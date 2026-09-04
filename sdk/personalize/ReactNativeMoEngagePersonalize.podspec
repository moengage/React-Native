require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeMoEngagePersonalize"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://www.moengage.com"
  s.license      = package['license']
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/moengage/React-Native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.public_header_files = 'ios/**/*.h'

  s.dependency "React-Core"
  s.dependency "MoEngagePluginPersonalize",'1.1.0'
  # MoEngagePluginPersonalize 1.1.0 has an unconstrained dependency on MoEngagePersonalization,
  # so CocoaPods resolves it to the latest published version. Pin it to the version tested
  # against the MoEngageCore version pinned transitively via MoEngagePluginBase
  # (MoEngage-iOS-SDK 10.14.0 -> MoEngageCore 10.09.0), otherwise a newer MoEngagePersonalization
  # can require MoEngageCore symbols missing from the pinned Core version, breaking the link.
  s.dependency 'MoEngagePersonalization', '1.2.0'
  s.dependency 'ReactNativeMoEngage'
  s.module_map = false

  install_modules_dependencies(s)
end

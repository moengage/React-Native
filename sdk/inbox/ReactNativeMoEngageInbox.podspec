require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeMoEngageInbox"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://www.moengage.com"
  s.license      = package['license']
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/moengage/React-Native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "React-Core"
  s.dependency "MoEngagePluginInbox",'>= 2.8.0','< 2.9.0'

  install_modules_dependencies(s)

end

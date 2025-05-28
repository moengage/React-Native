require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeMoEngageInbox"
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
  s.dependency "MoEngagePluginInbox",'4.0.0'
  s.dependency 'ReactNativeMoEngage'
  s.module_map = false

  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s);
  else
    s.dependency "React-Core"
  end

end

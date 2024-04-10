# react-native-cards.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNativeMoEngageCards"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                    A React Native plugin for supporting MoEngage Cards Campaign.
                   DESC
  s.homepage     = "https://www.moengage.com"
  s.license      = package['license']
  s.authors      = "MoEngage Inc."
  s.platforms    = { :ios => "11.0" }
 s.source              = {:file => './' }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.dependency          'React'
  
  s.dependency          'MoEngagePluginCards','>= 1.5.0','< 1.6.0'
  install_modules_dependencies(s)

end


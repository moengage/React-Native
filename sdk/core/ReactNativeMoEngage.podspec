require 'json'
package = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name                = "ReactNativeMoEngage"
  s.version             = package["version"]
  s.description         = package["description"]
  s.summary             = <<-DESC
                            A React Native plugin for implementation of MoEngage-iOS-SDK.
                          DESC
  s.homepage            = "https://www.moengage.com"
  s.license             = package['license']
  s.authors             = "MoEngage Inc."
  s.source              = {:file => './' }
  s.platforms = { :ios => "11.0", :tvos => "11.0" }
  s.source_files        = 'iOS/MoEReactBridge/**/*.{h,m,mm}'
  s.dependency          'React'
  s.dependency          'MoEngagePluginBase','5.1.1'
  s.ios.dependency  	'MoEngage-iOS-SDK/RichNotification'

  s.prepare_command = <<-CMD
    echo // Generated file, do not edit > iOS/MoEReactBridge/MoEngageReactPluginInfo.h
    echo "#define MOE_REACT_PLUGIN_VERSION @\\"#{package["version"]}\\"" >> iOS/MoEReactBridge/MoEngageReactPluginInfo.h
  CMD


  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s);
  else
    s.dependency "React-Core"
  end
end

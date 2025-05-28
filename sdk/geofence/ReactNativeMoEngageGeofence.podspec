require 'json'
package = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|
  s.name                = "ReactNativeMoEngageGeofence"
  s.version             = package["version"]
  s.description         = package["description"]
  s.summary             = <<-DESC
                            A React Native plugin for supporting Geofence based push campaigns in an app.
                          DESC
  s.homepage            = "https://www.moengage.com"
  s.license             = package['license']
  s.authors             = "MoEngage Inc."
  s.source              = {:file => './' }
  s.platform            = :ios, "13.0"
  s.dependency          'MoEngagePluginGeofence', '4.0.0'
  s.dependency          'React'
  s.dependency 'ReactNativeMoEngage'
  s.source_files        = "ios/**/*.{h,m,mm,swift}"
  s.public_header_files = 'ios/**/*.h'
  s.module_map = false
  

  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s);
  else
    s.dependency "React-Core"
  end
end

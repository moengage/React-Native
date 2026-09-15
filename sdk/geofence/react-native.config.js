module.exports = {
  // React Native's SPM autolinker derives a package's Swift name with
  // toSwiftName(<npm name>), which would yield `ReactNativeMoengageGeofence`
  // (lowercase `e`). Override it so the SwiftPM product matches the
  // CocoaPods module name and MoEngage's own capitalisation.
  spm: {
    name: 'ReactNativeMoEngageGeofence',
  },
};

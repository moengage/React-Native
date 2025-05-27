"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withMoEngageAndroid_1 = require("./withMoEngageAndroid");
const withMoEngageIOS_1 = require("./withMoEngageIOS");
const withMoEngage = (config, props) => {
    // Apply Android configuration
    config = (0, withMoEngageAndroid_1.withMoEngageAndroid)(config, props);
    // Apply iOS configuration
    config = (0, withMoEngageIOS_1.withMoEngageIOS)(config, props);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withMoEngage, 'moengage-expo-plugin', '1.0.0');

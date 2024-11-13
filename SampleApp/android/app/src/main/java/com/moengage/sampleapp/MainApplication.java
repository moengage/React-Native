package com.moengage.sampleapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.defaults.DefaultReactHost;
import com.moengage.core.DataCenter;
import com.moengage.core.LogLevel;
import com.moengage.core.MoEngage;
import com.moengage.core.config.LogConfig;
import com.moengage.core.config.MoEDefaultConfig;
import com.moengage.core.config.NotificationConfig;
import com.moengage.pushbase.MoEPushHelper;
import com.moengage.react.MoEInitializer;
import java.io.IOException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactHost getReactHost() {
    return DefaultReactHost.getDefaultReactHost(getApplicationContext(), mReactNativeHost);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
   try {
     SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
   } catch(IOException e) {
       e.printStackTrace();
   }
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    // replace DataCenter.DATA_CENTER_1 with your data center.
    MoEngage.Builder moEngage =
        new MoEngage.Builder(this, BuildConfig.MOENAGE_APP_ID, DataCenter.DATA_CENTER_1)
            .configureLogs(new LogConfig(LogLevel.VERBOSE, true))
            .configureNotificationMetaData(
                new NotificationConfig(
                    R.drawable.small_icon,
                    R.drawable.large_icon,
                    MoEDefaultConfig.NOTIFICATION_CONFIG_DEFAULT_COLOR_RESOURCE_ID,
                    MoEDefaultConfig.NOTIFICATION_CONFIG_DEFAULT_MULTIPLE_NOTIFICATION_STATE,
                    true,
                    MoEDefaultConfig.NOTIFICATION_CONFIG_DEFAULT_LARGE_ICON_STATE
                )
            );
    MoEInitializer.INSTANCE.initializeDefaultInstance(getApplicationContext(), moEngage, true);
    MoEPushHelper.getInstance().setUpNotificationChannels(this.getApplicationContext());
  }
}

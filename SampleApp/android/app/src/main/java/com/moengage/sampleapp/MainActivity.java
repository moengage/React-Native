package com.moengage.sampleapp;

import android.content.res.Configuration;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SampleApp";
  }

  @Override public void onConfigurationChanged(@NonNull Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // MoEReactHelper.getInstance().onConfigurationChanged();
  }

  @Override public void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(null);
  }
}

package expo.modules.moengage

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener
import com.moengage.react.MoEInitializer

class MoEngageApplicationLifecycleListener() : ApplicationLifecycleListener {
    
    override fun onCreate(application: Application) {
        super.onCreate(application)
        MoEInitializer.initializeDefaultInstance(application)
    }
}
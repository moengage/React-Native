package expo.modules.moengage

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class MoEngagePackage : Package {

    override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
        return listOf(MoEngageApplicationLifecycleListener())
    }
}
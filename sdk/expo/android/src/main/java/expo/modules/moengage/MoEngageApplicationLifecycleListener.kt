package expo.modules.moengage

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener
import com.moengage.core.internal.logger.Logger
import com.moengage.core.LogLevel
import expo.modules.moengage.internal.BASE_TAG
import expo.modules.moengage.internal.INTEGRATION_TYPE
import com.moengage.plugin.base.internal.PluginInitializer
import com.moengage.core.internal.model.IntegrationMeta

class MoEngageApplicationLifecycleListener() : ApplicationLifecycleListener {

    private val tag = "${BASE_TAG}_MoEngageApplicationLifecycleListener"

    override fun onCreate(application: Application) {
        super.onCreate(application)
        try {
            Logger.print { "$tag onCreate(): Initialising MoEngage SDK" }
            PluginInitializer.initialize(
                application = application,
                integrationMeta = IntegrationMeta(
                    INTEGRATION_TYPE,
                    BuildConfig.MOENGAGE_REACT_EXPO_LIB_VERSION
                )
            )
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag onCreate(): " }
        }
    }
}
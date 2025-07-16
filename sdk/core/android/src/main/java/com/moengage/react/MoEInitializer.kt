package com.moengage.react

import android.content.Context
import com.moengage.core.LogLevel
import com.moengage.core.MoEngage
import com.moengage.core.internal.logger.Logger
import com.moengage.core.internal.model.IntegrationMeta
import com.moengage.core.model.SdkState
import com.moengage.plugin.base.internal.PluginInitializer
import android.app.Application


/**
 * @author Umang Chamaria
 * Date: 2019-12-03
 */
object MoEInitializer {
    private const val tag = "${MODULE_TAG}MoEInitializer"

    @JvmOverloads
    fun initializeDefaultInstance(
        context: Context,
        builder: MoEngage.Builder,
        lifecycleAwareCallbackEnabled: Boolean = false
    ) {
        try {
            Logger.print { "$tag initialize() : Will try to initialize the sdk." }
            GlobalCache.lifecycleAwareCallbackEnabled = lifecycleAwareCallbackEnabled
            PluginInitializer.initialize(
                builder,
                IntegrationMeta(INTEGRATION_TYPE, BuildConfig.MOENGAGE_REACT_LIBRARY_VERSION)
            )
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
        }
    }

    @JvmOverloads
    fun initializeDefaultInstance(
        context: Context,
        builder: MoEngage.Builder,
        sdkState: SdkState,
        lifecycleAwareCallbackEnabled: Boolean = false
    ) {
        try {
            Logger.print { "$tag initialize() : Initialising MoEngage SDK." }
            GlobalCache.lifecycleAwareCallbackEnabled = lifecycleAwareCallbackEnabled
            PluginInitializer.initialize(
                builder,
                IntegrationMeta(INTEGRATION_TYPE, BuildConfig.MOENGAGE_REACT_LIBRARY_VERSION),
                sdkState
            )
            Logger.print { "$tag initialize() : " }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
        }
    }

    /**
     * Initialize SDK using file based configuration.
     *
     * Note: While using this function to intialize the SDK, make sure you have configured all the
     * required configuration in the xml as resource value
     */
    @JvmOverloads
    fun initializeDefaultInstance(
        application: Application,
        lifecycleAwareCallbackEnabled: Boolean = false,
        sdkState: SdkState? = null,
    ) {
        try {
            Logger.print { "$tag initialize(): Initialising MoEngage SDK" }
            GlobalCache.lifecycleAwareCallbackEnabled = lifecycleAwareCallbackEnabled
            PluginInitializer.initialize(
                application = application,
                integrationMeta = IntegrationMeta(
                    INTEGRATION_TYPE,
                    BuildConfig.MOENGAGE_REACT_LIBRARY_VERSION
                ),
                sdkState = sdkState
            )
            Logger.print { "$tag initialize(): " }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag initialize(): " }
        }
    }
}
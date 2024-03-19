package com.moengage.react

import android.content.Context
import com.moengage.core.LogLevel
import com.moengage.core.MoEngage
import com.moengage.core.internal.logger.Logger
import com.moengage.core.internal.model.IntegrationMeta
import com.moengage.core.model.SdkState
import com.moengage.plugin.base.internal.PluginInitializer


/**
 * @author Umang Chamaria
 * Date: 2019-12-03
 */
object MoEInitializer {
    private const val tag = "${MODULE_TAG}MoEInitializer"

    @Deprecated(
        "",
        level = DeprecationLevel.WARNING,
        replaceWith = ReplaceWith(
            "initializeDefaultInstance(context, builder)",
            "com.moengage.react.MoEInitializer.initializeDefaultInstance"
        )
    )
    fun initialize(context: Context, builder: MoEngage.Builder) {
        initializeDefaultInstance(context, builder)
    }

    @Deprecated(
        "",
        level = DeprecationLevel.WARNING,
        replaceWith = ReplaceWith(
            "initializeDefaultInstance(context, builder, sdkState)",
            "com.moengage.react.MoEInitializer.initializeDefaultInstance"
        )
    )
    fun initialize(context: Context, builder: MoEngage.Builder, sdkState: SdkState) {
        initializeDefaultInstance(context, builder, sdkState)
    }

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


}
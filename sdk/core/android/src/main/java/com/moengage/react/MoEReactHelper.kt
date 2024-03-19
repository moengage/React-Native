package com.moengage.react

import com.moengage.core.internal.inapp.InAppManager
import com.moengage.core.internal.logger.Logger
import com.moengage.inapp.MoEInAppHelper

/**
 * @author Umang Chamaria
 * Date: 2021/08/18
 */
public class MoEReactHelper {

    private val tag = "${MODULE_TAG}MoEReactHelper"

    public fun onConfigurationChanged() {
        if (!InAppManager.hasModule()){
            Logger.print { "$tag onConfigurationChanged() :  InApp Module not present." }
            return
        }
        MoEInAppHelper.getInstance().onConfigurationChanged()
    }

    public companion object {

        private var instance: MoEReactHelper? = null

        @JvmStatic
        public fun getInstance(): MoEReactHelper {
            return instance ?: synchronized(MoEReactHelper::class.java) {
                val inst = instance ?: MoEReactHelper()
                instance = inst
                inst
            }
        }
    }
}
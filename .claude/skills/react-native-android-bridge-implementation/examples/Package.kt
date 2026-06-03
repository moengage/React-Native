// Filename: MoEngage<featureNameCamel>Package.kt
package <rnPackage>

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class MoEngage<featureNameCamel>Package : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == <rnBridgeName>Handler.NAME) MoEngage<featureNameCamel>Bridge(reactContext) else null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            moduleInfos[<rnBridgeName>Handler.NAME] = ReactModuleInfo(
                <rnBridgeName>Handler.NAME,
                <rnBridgeName>Handler.NAME,
                false, false, true, false, isTurboModule
            )
            moduleInfos
        }
    }
}

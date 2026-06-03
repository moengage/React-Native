// Filename: MoEngage<featureNameCamel>Bridge.kt  (place in src/oldarch/)
package <rnPackage>

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MoEngage<featureNameCamel>Bridge(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private val bridgeHandler = <rnBridgeName>Handler(reactContext)

    override fun getName() = bridgeHandler.getName()

    // Only if nativeToHybrid events exist:
    @ReactMethod fun addListener(eventName: String) {}
    @ReactMethod fun removeListeners(count: Int) {}

    // Fire-and-forget (one @ReactMethod per method):
    @ReactMethod fun <methodName>(payload: String) { bridgeHandler.<methodName>(payload) }

    // Promise (one @ReactMethod per method):
    @ReactMethod fun <methodName>(payload: String, promise: Promise) { bridgeHandler.<methodName>(payload, promise) }
}

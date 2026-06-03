// Filename: MoEngage<featureNameCamel>Bridge.kt  (place in src/newarch/)
package <rnPackage>

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class MoEngage<featureNameCamel>Bridge(reactContext: ReactApplicationContext) :
    NativeMoEngage<featureNameCamel>Spec(reactContext) {

    private val bridgeHandler = <rnBridgeName>Handler(reactContext)

    override fun getName() = bridgeHandler.getName()

    // Only if nativeToHybrid events exist:
    override fun addListener(eventName: String) {}
    override fun removeListeners(count: Double) {}

    // Fire-and-forget (one override per method):
    override fun <methodName>(payload: String) { bridgeHandler.<methodName>(payload) }

    // Promise (one override per method):
    override fun <methodName>(payload: String, promise: Promise) { bridgeHandler.<methodName>(payload, promise) }
}

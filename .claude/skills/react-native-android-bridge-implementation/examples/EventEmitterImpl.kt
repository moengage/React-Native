// Only create this file when nativeToHybrid events exist.
package <rnPackage>

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.<featureName>.internal.<featureNameCamel>EventEmitter
import com.moengage.plugin.base.<featureName>.internal.model.events.<featureNameCamel>Event
import com.moengage.plugin.base.<featureName>.internal.model.events.<SpecificEvent>

class EventEmitterImpl(private val reactContext: ReactContext) : <featureNameCamel>EventEmitter {

    private val tag = "${MODULE_TAG}_EventEmitterImpl"

    override fun emit(event: <featureNameCamel>Event) {
        try {
            when (event) {
                is <SpecificEvent> -> emit<SpecificEvent>(event)
                else -> Logger.print(LogLevel.ERROR) { "$tag emit() Unknown Event: $event" }
            }
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit(): $event" }
        }
    }

    private fun emit<SpecificEvent>(event: <SpecificEvent>) {
        try {
            val payload = PayloadGenerator().<specificEventToWritableMap>(event)
            emit(EVENT_<METHOD_NAME_UPPER>, payload)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit<SpecificEvent>(): $event" }
        }
    }

    private fun emit(eventName: String, params: WritableMap) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (t: Throwable) {
            Logger.print(LogLevel.ERROR, t) { "$tag emit() : " }
        }
    }
}

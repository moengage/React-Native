// Only create this file when nativeToHybrid events exist.
package <rnPackage>

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.moengage.core.LogLevel
import com.moengage.core.internal.logger.Logger
import com.moengage.plugin.base.<featureName>.internal.model.events.<SpecificEvent>

internal class PayloadGenerator {

    private val tag = "${MODULE_TAG}PayloadGenerator"

    fun <specificEventToWritableMap>(event: <SpecificEvent>): WritableMap {
        val map = Arguments.createMap()
        // Serialize event data using kotlinx.serialization, then put in map:
        val eventJson = /* Json.encodeToString(event.data) */
        Logger.print { "$tag <specificEventToWritableMap>() : $event" }
        map.putString("payload", eventJson)
        return map
    }
}

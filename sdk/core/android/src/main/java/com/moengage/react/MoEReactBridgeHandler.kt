/*
 * Copyright (c) 2014-2024 MoEngage Inc.
 *
 * All rights reserved.
 *
 *  Use of source code or binaries contained within MoEngage SDK is permitted only to enable use of the MoEngage platform by customers of MoEngage.
 *  Modification of source code and inclusion in mobile apps is explicitly allowed provided that all other conditions are met.
 *  Neither the name of MoEngage nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *  Redistribution of source code or binaries is disallowed except with specific prior written permission. Any such redistribution must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

 package com.moengage.react

 import android.content.Context
 import com.facebook.react.bridge.Promise
 import com.facebook.react.bridge.ReactApplicationContext
 import com.moengage.core.LogLevel
 import com.moengage.core.MoECoreHelper
 import com.moengage.core.internal.logger.Logger
 import com.moengage.core.listeners.AppBackgroundListener
 import com.moengage.plugin.base.internal.PluginHelper
 import com.moengage.plugin.base.internal.selfHandledInAppsToJson
 import com.moengage.plugin.base.internal.setEventEmitter
 import com.moengage.plugin.base.internal.userDeletionDataToJson
 
 /**
  * Class to handle all the request from the [MoEReactBridge] from both old and new arch
  *
  * @author Abhishek Kumar
  * @since Todo: Add Version
  */
 internal class MoEReactBridgeHandler(private val reactContext: ReactApplicationContext) {
 
     private val tag = "${MODULE_TAG}MoEReactBridgeHandler"
 
     private val context: Context = reactContext.applicationContext
     private val pluginHelper = PluginHelper()
 
     private val backgroundStateListener =
         AppBackgroundListener { _, _ -> pluginHelper.onFrameworkDetached() }
 
     fun getName() = NAME
 
     fun setAppStatus(payload: String) {
         try {
             Logger.print { "$tag setAppStatus() : Payload: $payload" }
             pluginHelper.setAppStatus(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag setAppStatus() : " }
         }
     }
 
     fun trackEvent(payload: String) {
         try {
             Logger.print { "$tag trackEvent() : Payload: $payload" }
             pluginHelper.trackEvent(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag trackEvent() : " }
         }
     }
 
     fun setUserAttribute(payload: String) {
         try {
             Logger.print { "$tag setUserAttribute() : Payload: $payload" }
             pluginHelper.setUserAttribute(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag setUserAttribute() : " }
         }
     }
 
     fun logout(payload: String) {
         try {
             Logger.print { "$tag logout() : $payload" }
             pluginHelper.logout(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag logout() : " }
         }
     }
 
     fun setAlias(payload: String) {
         try {
             Logger.print { "$tag setAlias() : Payload: $payload" }
             pluginHelper.setAlias(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag setAlias() : " }
         }
     }
 
     fun setAppContext(payload: String) {
         try {
             Logger.print { "$tag setAppContext() : Payload: $payload" }
             pluginHelper.setAppContext(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag setAppContext() : " }
         }
     }
 
     fun resetAppContext(payload: String) {
         try {
             Logger.print { "$tag resetAppContext() : $payload" }
             pluginHelper.resetAppContext(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag resetAppContext() : " }
         }
     }
 
     fun showInApp(payload: String) {
         try {
             Logger.print { "$tag showInApp() : $payload" }
             pluginHelper.showInApp(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag showInApp() : " }
         }
     }
 
     fun getSelfHandledInApp(payload: String) {
         try {
             Logger.print { "$tag getSelfHandledInApp() : $payload" }
             pluginHelper.getSelfHandledInApp(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag getSelfHandledInApp() : " }
         }
     }
 
     fun passPushToken(payload: String) {
         try {
             Logger.print { "$tag passPushToken() : $payload" }
             pluginHelper.passPushToken(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag passPushToken() : " }
         }
     }
 
     fun passPushPayload(payload: String) {
         try {
             Logger.print { "$tag passPushPayload() : $payload" }
             pluginHelper.passPushPayload(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag passPushPayload() : " }
         }
     }
 
     fun initialize(payload: String) {
         try {
             Logger.print { "$tag initialize() : $payload" }
             pluginHelper.initialise(payload)
             setEventEmitter(EventEmitterImpl(reactContext))
             if (GlobalCache.lifecycleAwareCallbackEnabled) {
                 MoECoreHelper.addAppBackgroundListener(backgroundStateListener)
             }
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag initialize() : " }
         }
     }
 
     fun selfHandledCallback(payload: String) {
         try {
             Logger.print { "$tag selfHandledCallback() : $payload" }
             pluginHelper.selfHandledCallback(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag selfHandledCallback() : " }
         }
     }
 
     fun optOutTracking(payload: String) {
         try {
             pluginHelper.optOutTracking(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag optOutTracking() : " }
         }
     }
 
     fun updateSdkState(payload: String) {
         try {
             Logger.print { "$tag updateSdkState() : $payload" }
             pluginHelper.storeFeatureStatus(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag updateSdkState() : " }
         }
     }
 
     fun onOrientationChanged() {
         try {
             Logger.print { "$tag onOrientationChanged() : " }
             pluginHelper.onConfigurationChanged()
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag onOrientationChanged() : " }
         }
     }
 
     fun deviceIdentifierTrackingStatusUpdate(payload: String) {
         try {
             Logger.print { "$tag deviceIdentifierTrackingStatusUpdate() : $payload" }
             pluginHelper.deviceIdentifierTrackingStatusUpdate(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag deviceIdentifierTrackingStatusUpdate() : " }
         }
     }
 
     fun setupNotificationChannels() {
         try {
             Logger.print { "$tag setupNotificationChannels() : " }
             pluginHelper.setUpNotificationChannels(context)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag setupNotificationChannel() :" }
         }
     }
 
     fun navigateToSettings() {
         try {
             Logger.print { "$tag navigateToSettings() : " }
             pluginHelper.navigateToSettings(context)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag navigateToSettings() :" }
         }
     }
 
     fun requestPushPermission() {
         try {
             Logger.print { "$tag requestPushPermission() : " }
             pluginHelper.requestPushPermission(context)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag requestPushPermission() :" }
         }
     }
 
     fun permissionResponse(payload: String) {
         try {
             Logger.print { "$tag permissionResponse() : Payload: $payload" }
             pluginHelper.permissionResponse(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag permissionResponse() :" }
         }
     }
 
     fun updatePushPermissionRequestCount(payload: String) {
         try {
             Logger.print { "$tag updatePushPermissionRequestCount() : Payload: $payload" }
             pluginHelper.updatePushPermissionRequestCount(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag updatePushPermissionRequestCount() :" }
         }
     }
 
     fun deleteUser(payload: String, promise: Promise) {
         try {
             Logger.print { "$tag deleteUser() : Payload: $payload" }
             pluginHelper.deleteUser(context, payload) { userDeletionData ->
                 promise.resolve(userDeletionDataToJson(userDeletionData).toString())
             }
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag deleteUser() :" }
             promise.reject(t)
         }
     }
 
     fun showNudge(payload: String) {
         try {
             Logger.print { "$tag showNudge() : Payload: $payload" }
             pluginHelper.showNudge(context, payload)
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag showNudge() :" }
         }
     }
 
     companion object {
         const val NAME = "MoEReactBridge"
     }
 
     fun getSelfHandledInApps(payload: String, promise: Promise) {
         try {
             Logger.print { "$tag getSelfHandledInApps() : Payload: $payload" }
             pluginHelper.getSelfHandledInApps(context, payload) { data ->
                 promise.resolve(selfHandledInAppsToJson(data).toString())
             }
         } catch (t: Throwable) {
             Logger.print(LogLevel.ERROR, t) { "$tag getSelfHandledInApps() :" }
             promise.reject(t)
         }
     }
 }
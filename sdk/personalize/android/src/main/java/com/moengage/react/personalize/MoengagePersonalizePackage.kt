/*
 * Copyright (c) 2026 MoEngage, Inc.
 * All rights reserved.
 * Use of source code or binaries contained within MoEngage's SDKs is permitted only to enable use of the MoEngage platform by customers of MoEngage. The Licensee may not:
 * - permit any third party to use the Software;
 * - modify or translate the Software except as otherwise permitted;
 * - reverse engineer, decompile, or disassemble the Software;
 * - copy the Software, except as expressly provided above; or
 * - remove or obscure any proprietary rights notices or labels on the Software.
 * - Licensee may not transfer the Software or any rights under this Agreement without the Licensor's prior written consent.
 * - MoEngage owns the Software and all intellectual property rights embodied therein, including copyrights and valuable trade secrets embodied in the Software. The Licensee shall not alter or remove this copyright notice.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF THE USER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.moengage.react.personalize

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class MoengagePersonalizePackage : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == MoEngagePersonalizeHandler.NAME) {
            MoEReactPersonalize(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            moduleInfos[MoEngagePersonalizeHandler.NAME] = ReactModuleInfo(
                MoEngagePersonalizeHandler.NAME,
                MoEngagePersonalizeHandler.NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                true,   // hasConstants
                false,  // isCxxModule
                isTurboModule // isTurboModule
            )
            moduleInfos
        }
    }
}

// Filename: NativeMoEngage<featureNameCamel>.ts
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  // Fire-and-forget (hybridToNative only):
  /**
   * <description from contract>
   * @param payload Stringified JSON Payload
   */
  <methodName>: (payload: string) => void;

  // Promise (hybridToNative + nativeToHybrid):
  /**
   * <description from contract>
   * @param payload Stringified JSON Payload
   * @returns {Promise<string>} Stringified JSON response matching nativeToHybrid contract
   */
  <methodName>(payload: string): Promise<string>;

  // Only include if nativeToHybrid events exist:
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

const <rnBridgeName> = TurboModuleRegistry.getEnforcing<Spec>('<rnBridgeName>');
export default <rnBridgeName>;

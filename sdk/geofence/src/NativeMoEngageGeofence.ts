import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  /**
   * Call this method to start Geofence tracking.
   * 
   * @param payload Stringified JSON Payload
   */
  startGeofenceMonitoring: (payload: string) => void;

  /**
   * Call this method to stop Geofence tracking
   * 
   * @param payload Stringified JSON Payload
   */
  stopGeofenceMonitoring: (payload: string) => void;
}

const MoEReactGeofence = TurboModuleRegistry.getEnforcing<Spec>('MoEReactGeofence');
export default MoEReactGeofence;
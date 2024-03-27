import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  startGeofenceMonitoring:(payload: string) => void;
  stopGeofenceMonitoring:(payload: string) => void;
}

const MoEReactGeofence = TurboModuleRegistry.getEnforcing<Spec>('MoEReactGeofence');
export default MoEReactGeofence;
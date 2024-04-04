import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    fetchAllMessages(payload: string): Promise<string>;
    getUnClickedCount(payload: string): Promise<string>;
    trackMessageClicked:(payload: string) => void;
    deleteMessage:(payload: string) => void;
}

const MoEngageReactInbox = TurboModuleRegistry.getEnforcing<Spec>('MoEReactInbox');
export default MoEngageReactInbox;
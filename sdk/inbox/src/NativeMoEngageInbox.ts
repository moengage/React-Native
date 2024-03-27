import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    fetchAllMessages(payload: string): Promise<Object | Error>;
    getUnClickedCount(payload: string): Promise<Object | Error>;
    trackMessageClicked:(payload: string) => void;
    deleteMessage:(payload: string) => void;
}

const MoEngageReactInbox = TurboModuleRegistry.getEnforcing<Spec>('MoEReactInbox');
export default MoEngageReactInbox;
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    /**
     * API to fetch all the inbox messages.
     * 
     * @param payload Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains inbox messages.
     */
    fetchAllMessages(payload: string): Promise<string>;

    /**
     * API to get the count of unclicked inbox messages.
     * 
     * @param payload  Stringified JSON payload.
     * 
     * @returns {Promise<string>} A promise that contains unclicked message count payload
     */
    getUnClickedCount(payload: string): Promise<string>;

    /**
     * API to track the click on inbox message.
     * 
     * @param payload Stringified JSON payload.
     */
    trackMessageClicked: (payload: string) => void;

    /**
     * API to delete a particular message from the list of messages
     * 
     * @param payload Stringified JSON payload.
     */
    deleteMessage: (payload: string) => void;
}

const MoEngageReactInbox = TurboModuleRegistry.getEnforcing<Spec>('MoEReactInbox');
export default MoEngageReactInbox;
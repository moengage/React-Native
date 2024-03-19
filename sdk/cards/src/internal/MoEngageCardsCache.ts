import SyncCompleteData from "../model/SyncData";
import SyncType from "../model/enums/SyncType";

/**
 * Global Cache to store the cache for Cards Plugin
 * 
 * @since 1.0.0
 * @author Abhishek Kumar
 */
namespace MoEngageCardsCache {

    /**
     * Sync Event Listener Cache
     * @since 1.0.0
     */
    let eventListenerCache: Map<SyncType, (data: SyncCompleteData | null) => void> = new Map();

    export function cacheEventListenerCallback(syncType: SyncType, onTrigger: (data: SyncCompleteData | null) => void): void {
        eventListenerCache.set(syncType, onTrigger);
    }

    export function getCallbackForCachedEvent(syncType: SyncType): ((data: SyncCompleteData | null) => void) | undefined {
        return eventListenerCache.get(syncType);
    }

    export function removeCacheForEvent(syncType: SyncType): void {
        eventListenerCache.delete(syncType);
    }
}

export default MoEngageCardsCache;
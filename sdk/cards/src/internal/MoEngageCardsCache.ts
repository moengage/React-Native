import SyncCompleteData from "../model/SyncData";
import CardListenerEvent from "../model/enums/CardListenerEvent";

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
    let eventListenerCache: Map<CardListenerEvent, (data: SyncCompleteData | null) => void> = new Map();

    export function cacheEventListenerCallback(syncType: CardListenerEvent, onTrigger: (data: SyncCompleteData | null) => void): void {
        eventListenerCache.set(syncType, onTrigger);
    }

    export function getCallbackForCachedEvent(syncType: CardListenerEvent): ((data: SyncCompleteData | null) => void) | undefined {
        return eventListenerCache.get(syncType);
    }

    export function removeCacheForEvent(syncType: CardListenerEvent): void {
        eventListenerCache.delete(syncType);
    }
}

export default MoEngageCardsCache;
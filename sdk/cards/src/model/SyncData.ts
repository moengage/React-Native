import SyncType from "./enums/SyncType";

/**
 * Data on API sync complete.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class SyncCompleteData {

    /**
     * Indicating if there were any updates in the cards post sync. true if there are any new
     * updates present else false. This value is true even if card(s) are deleted.
     * @since 1.0.0
     */
    hasUpdates: boolean;

    /**
     * Condition under which sync was triggered. Refer to {@link SyncType}
     * @since 1.0.0
     */
    syncType: SyncType;

    constructor(hasUpdates: boolean, syncType: SyncType) {
        this.hasUpdates = hasUpdates;
        this.syncType = syncType;
    }
}

export default SyncCompleteData;
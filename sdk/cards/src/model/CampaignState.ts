/**
 * State of the card.
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class CampaignState {

    /**
     * Number of times card shown on the current device
     * @since 1.0.0
     */
    localShowCount: number;

    /**
     * True if the user has clicked the card, else false.
     * @since 1.0.0
     */
    isClicked: boolean;

    /**
     * First Time the card was received.
     * @since 1.0.0
     */
    firstReceived: number;

    /**
     * First Time the card was seen by the user.
     * @since 1.0.0
     */
    firstSeen: number;

    /**
     * Total number of times campaign has been seen by the user across devices.
     * @since 1.0.0
     */
    totalShowCount: number;

    constructor(
        localShowCount: number,
        isClicked: boolean,
        firstReceived: number,
        firstSeen: number,
        totalShowCount: number
    ) {
        this.localShowCount = localShowCount;
        this.isClicked = isClicked;
        this.firstReceived = firstReceived;
        this.firstSeen = firstSeen;
        this.totalShowCount = totalShowCount;
    }
}

export default CampaignState;
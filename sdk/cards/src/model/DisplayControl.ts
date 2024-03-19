import ShowTime from "./ShowTime";

/**
 * Delivery Controls defined during campaign creation.
 *
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class DisplayControl {

    /**
     * Absolute time at which the card should be expired.
     *
     * Value in seconds.
     * @since 1.0.0
     */
    expireAt: number;

    /**
     * Time duration after which card should be expired once it is seen.
     *
     * Value in seconds.
     * @since 1.0.0
     */
    expireAfterSeen: number;

    /**
     * Time duration after which the card should be expired once it is delivered on the device.
     *
     * Value in seconds.
     * @since 1.0.0
     */
    expireAfterDelivered: number;

    /**
     * Maximum number of times a campaign should be shown to the user across devices.
     * @since 1.0.0
     */
    maxCount: number;

    /**
     * True if the campaign is pinned on top, else false.
     * @since 1.0.0
     */
    isPinned: boolean;

    /**
     * Time during the day when the campaign should be shown.
     * @since 1.0.0
     */
    showTime: ShowTime;

    constructor(
        expireAt: number,
        expireAfterSeen: number,
        expireAfterDelivered: number,
        maxCount: number,
        isPinned: boolean,
        showTime: ShowTime
    ) {
        this.expireAt = expireAt;
        this.expireAfterSeen = expireAfterSeen;
        this.expireAfterDelivered = expireAfterDelivered;
        this.maxCount = maxCount;
        this.isPinned = isPinned;
        this.showTime = showTime;
    }
}

export default DisplayControl;
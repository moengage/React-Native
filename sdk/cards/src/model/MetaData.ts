import CampaignState from "./CampaignState";
import DisplayControl from "./DisplayControl";

/**
 * Meta data related to a campaign.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class MetaData {

    /**
     * True if the campaign should be pinned to the top else false.
     * @since 1.0.0
     */
    isPinned: boolean;

    /**
     * True if the campaign hasn't been delivered to the inbox, else false.
     * @since 1.0.0
     */
    isNewCard: boolean;

    /**
     * Current state of the campaign.
     * @since 1.0.0
     */
    campaignState: CampaignState;

    /**
     * Time at which the campaign would be deleted from local store.
     * @since 1.0.0
     */
    deletionTime: number;

    /**
     * Delivery Controls defined during campaign creation.
     * @since 1.0.0
     */
    displayControl: DisplayControl;

    /**
     * Additional meta data regarding campaign used for tracking purposes.
     * @since 1.0.0
     */
    metaData: { [k: string]: any };

    /**
     * Creation time for the campaign.
     * Notes: Available in iOS, default value is -1
     * @since 1.0.0
     */
    createdAt: number;

    /**
     * Last time the campaign was updated.
     * @since 1.0.0
     */
    updatedTime: number;

    /**
     * Complete Campaign payload.
     * @since 1.0.0
     */
    campaignPayload: { [k: string]: any };

    constructor(
        isPinned: boolean,
        isNewCard: boolean,
        campaignState: CampaignState,
        deletionTime: number,
        displayControl: DisplayControl,
        metaData: { [k: string]: any },
        createdAt: number,
        updatedTime: number,
        campaignPayload: { [k: string]: any }
    ) {
        this.isPinned = isPinned;
        this.isNewCard = isNewCard;
        this.campaignState = campaignState;
        this.deletionTime = deletionTime;
        this.displayControl = displayControl;
        this.metaData = metaData;
        this.createdAt = createdAt;
        this.updatedTime = updatedTime;
        this.campaignPayload = campaignPayload;
    }
}

export default MetaData;
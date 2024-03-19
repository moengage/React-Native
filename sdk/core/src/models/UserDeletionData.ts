import MoEAccountMeta from "./MoEAccountMeta";

/**
 * Delete User State Data while deleting the user from MoEngage SDK
 * 
 * @author Abhishek Kumar
 * @since 8.6.0
 */
export default class UserDeletionData {

    /**
     * Account Data, instance of {@link MoEAccountMeta}
     * @since 8.6.0
     */
    accountMeta: MoEAccountMeta;

    /**
     * User State, true if user delete succeeded else false
     * @since 8.6.0
     */
    isSuccess: boolean;

    constructor(accountMeta: MoEAccountMeta, isSuccess: boolean) {
        this.accountMeta = accountMeta;
        this.isSuccess = isSuccess;
    }
}

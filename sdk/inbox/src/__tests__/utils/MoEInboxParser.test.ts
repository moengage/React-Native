// Import the MoEInboxParser module
import { inboxMessageFromJson } from '../../utils/MoEInboxParser';
import { inboxMessage1, inboxMessageJson1 } from '../../__mocks__/InboxDataProvider';
import MoEInboxMessage from '../../model/MoEInboxMessage';

describe("MoEInboxParser", () => {
    it("should MoEInboxMessage object with groupKey and NotificationId null", () => {
        const result = inboxMessageFromJson(inboxMessageJson1);
        expect(result).toBeInstanceOf(MoEInboxMessage);
        expect(result).toEqual(inboxMessage1);
    });
});
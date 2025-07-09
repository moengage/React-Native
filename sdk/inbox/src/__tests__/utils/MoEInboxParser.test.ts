// Import the MoEInboxParser module
import { inboxMessageFromJson } from '../../utils/MoEInboxParser';
import { inboxMessage1, inboxMessageJson1, inboxMessageJson2, inboxMessage2 } from '../../__mocks__/InboxDataProvider';
import MoEInboxMessage from '../../model/MoEInboxMessage';

describe("MoEInboxParser", () => {
    it("MoEInboxMessage object with groupKey and NotificationId null", () => {
        const result = inboxMessageFromJson(inboxMessageJson1);
        expect(result).toBeInstanceOf(MoEInboxMessage);
        expect(result).toEqual(inboxMessage1);
    });

    it("MoEInboxMessage object with groupKey, NotificationId and media", () => {
        const result = inboxMessageFromJson(inboxMessageJson2);
        expect(result).toBeInstanceOf(MoEInboxMessage);
        expect(result).toEqual(inboxMessage2);
    });
});
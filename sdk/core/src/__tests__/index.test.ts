import { unsetUserAttributeSuccessPayload, unsetUserAttributeFailurePayload } from '../__mocks__/JsonDataProvider';
import ReactMoE from '../index';
import MoEUnsetUserAttributeResult from '../models/MoEUnsetUserAttributeResult';
import MoERequestFailure from '../models/MoERequestFailure';
import { MoEngageFailureReason } from '../models/MoEngageFailureReason';
import { MoEUserAttributeLevel } from '../models/MoEUserAttributeLevel';
import MoEngageLogger from '../logger/MoEngageLogger';

const mockUnsetUserAttribute = jest.fn();

jest.mock('react-native', () => ({
    NativeEventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
    })),
    Platform: { OS: 'ios' }
}));

jest.mock('../NativeMoEngage', () => ({
    __esModule: true,
    default: { unsetUserAttribute: (payload: string) => mockUnsetUserAttribute(payload) }
}));

describe('ReactMoE', () => {

    beforeEach(() => {
        mockUnsetUserAttribute.mockReset();
        jest.spyOn(MoEngageLogger, 'verbose').mockImplementation(() => { });
        jest.spyOn(MoEngageLogger, 'error').mockImplementation(() => { });
    });

    describe('unsetUserAttribute', () => {
        it('success payload should resolve with the unset result', async () => {
            mockUnsetUserAttribute.mockResolvedValue(unsetUserAttributeSuccessPayload);
            const result = await ReactMoE.unsetUserAttribute("trial_status");
            expect(result).toBeInstanceOf(MoEUnsetUserAttributeResult);
            expect(result).toEqual(new MoEUnsetUserAttributeResult("trial_status", MoEUserAttributeLevel.PROJECT));
            const payload = JSON.parse(mockUnsetUserAttribute.mock.calls[0][0]);
            expect(payload.data).toEqual({ attributeName: "trial_status", attributeLevel: "project" });
        });

        it('failure payload should reject with the failure', async () => {
            mockUnsetUserAttribute.mockResolvedValue(unsetUserAttributeFailurePayload);
            await expect(ReactMoE.unsetUserAttribute("loyalty_tier", MoEUserAttributeLevel.PORTFOLIO)).rejects.toEqual(
                new MoERequestFailure(MoEngageFailureReason.INVALID_INITIALISATION_CONFIGURATION, "Portfolio level requires a configured project id.")
            );
        });

        it('native rejection should reject with the failure from its code and message', async () => {
            mockUnsetUserAttribute.mockRejectedValue(Object.assign(new Error("SDK is not initialised"), { code: "SDK_STATE" }));
            await expect(ReactMoE.unsetUserAttribute("trial_status")).rejects.toEqual(
                new MoERequestFailure(MoEngageFailureReason.SDK_STATE, "SDK is not initialised")
            );
        });

        it.each([undefined, null, 42])('name %p should reject with INVALID_PARAMETERS without calling native', async (attributeName) => {
            const failure = await ReactMoE.unsetUserAttribute(attributeName as any).catch((error) => error);
            expect(failure).toBeInstanceOf(MoERequestFailure);
            expect(failure.reason).toEqual(MoEngageFailureReason.INVALID_PARAMETERS);
            expect(mockUnsetUserAttribute).not.toHaveBeenCalled();
        });

        it.each(["PORTFOLIO", "abc", null])('level %p should reject with INVALID_PARAMETERS without calling native', async (attributeLevel) => {
            const failure = await ReactMoE.unsetUserAttribute("trial_status", attributeLevel as any).catch((error) => error);
            expect(failure).toBeInstanceOf(MoERequestFailure);
            expect(failure.reason).toEqual(MoEngageFailureReason.INVALID_PARAMETERS);
            expect(mockUnsetUserAttribute).not.toHaveBeenCalled();
        });

        it('blank name should still go to native', async () => {
            mockUnsetUserAttribute.mockResolvedValue(unsetUserAttributeSuccessPayload);
            await ReactMoE.unsetUserAttribute(" ");
            expect(mockUnsetUserAttribute).toHaveBeenCalledTimes(1);
        });
    });
});

import { appId, logoutCompleteIosPayload, logoutCompleteInvalidPayload, authenticationErrorIosPayload, authenticationErrorInvalidPayload } from '../../__mocks__/JsonDataProvider';
import { executeHandler } from '../../utils/MoEEventHandlerHelper';
import MoELogoutCompleteData from '../../models/MoELogoutCompleteData';
import MoEAuthenticationErrorData from '../../models/MoEAuthenticationErrorData';
import { MoEPlatform } from '../../models/MoEPlatform';
import { MoEJwtErrorCode } from '../../models/MoEJwtErrorCode';

jest.mock('react-native', () => ({
    NativeEventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
    })),
    Platform: { OS: 'ios' }
}));

jest.mock('../../NativeMoEngage', () => ({ default: null }));

const LOGOUT_COMPLETE = 'logoutComplete';
const AUTHENTICATION_ERROR = 'authenticationError';
const MOE_PAYLOAD = 'payload';

describe('MoEEventHandlerHelper', () => {

    describe('executeHandler — logoutComplete', () => {
        it('valid payload should invoke handler with MoELogoutCompleteData', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: logoutCompleteIosPayload }, LOGOUT_COMPLETE);
            expect(handler).toHaveBeenCalledTimes(1);
            const result = handler.mock.calls[0][0];
            expect(result).toBeInstanceOf(MoELogoutCompleteData);
            expect(result.platform).toEqual(MoEPlatform.IOS);
            expect(result.accountMeta.appId).toEqual(appId);
        });

        it('invalid payload missing accountMeta should not invoke handler', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: logoutCompleteInvalidPayload }, LOGOUT_COMPLETE);
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('executeHandler — authenticationError', () => {
        it('valid payload should invoke handler with MoEAuthenticationErrorData', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: authenticationErrorIosPayload }, AUTHENTICATION_ERROR);
            expect(handler).toHaveBeenCalledTimes(1);
            const result = handler.mock.calls[0][0];
            expect(result).toBeInstanceOf(MoEAuthenticationErrorData);
            expect(result.platform).toEqual(MoEPlatform.IOS);
            expect(result.accountMeta.appId).toEqual(appId);
            expect(result.data.code).toEqual(MoEJwtErrorCode.TokenNotAvailable);
        });

        it('invalid payload missing accountMeta should not invoke handler', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: authenticationErrorInvalidPayload }, AUTHENTICATION_ERROR);
            expect(handler).not.toHaveBeenCalled();
        });
    });
});

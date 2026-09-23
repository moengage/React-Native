import { appId, logoutCompleteIosPayload, logoutCompleteInvalidPayload, authenticationErrorIosPayload, authenticationErrorInvalidPayload, inAppCustomActionIosPayload, inAppCustomActionKeyValuePair, pushClickedWithoutActionIosPayload, pushClickedWithoutActionAndroidPayload } from '../../__mocks__/JsonDataProvider';
import { executeHandler } from '../../utils/MoEEventHandlerHelper';
import MoELogoutCompleteData from '../../models/MoELogoutCompleteData';
import MoEAuthenticationErrorData from '../../models/MoEAuthenticationErrorData';
import MoEClickData from '../../models/MoEClickData';
import MoEInAppCustomAction from '../../models/MoEInAppCustomAction';
import MoEPushPayload from '../../models/MoEPushPayload';
import MoEngageLogger from '../../logger/MoEngageLogger';
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
const INAPP_CUSTOM_ACTION = 'inAppCampaignCustomAction';
const PUSH_CLICKED = 'pushClicked';
const MOE_PAYLOAD = 'payload';

describe('MoEEventHandlerHelper', () => {

    beforeEach(() => {
        jest.spyOn(MoEngageLogger, 'verbose').mockImplementation(() => { });
    });

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

    describe('executeHandler — inAppCampaignCustomAction', () => {
        it('iOS payload should forward the custom action key-value pairs', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: inAppCustomActionIosPayload }, INAPP_CUSTOM_ACTION);
            expect(handler).toHaveBeenCalledTimes(1);
            const result = handler.mock.calls[0][0];
            expect(result).toBeInstanceOf(MoEClickData);
            expect(result.platform).toEqual(MoEPlatform.IOS);
            expect(result.accountMeta.appId).toEqual(appId);
            expect(result.campaignData.campaignId).toEqual('dummyCampaignId');
            expect(result.action).toBeInstanceOf(MoEInAppCustomAction);
            expect(result.action.keyValuePair).toEqual(inAppCustomActionKeyValuePair);
        });
    });

    describe('executeHandler — pushClicked', () => {
        it('iOS push without screen name or key-value pairs should deliver an empty click action', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: pushClickedWithoutActionIosPayload, pushClickedWithoutActionAndroidPayload }, PUSH_CLICKED);
            expect(handler).toHaveBeenCalledTimes(1);
            const result = handler.mock.calls[0][0];
            expect(result).toBeInstanceOf(MoEPushPayload);
            expect(result.platform).toEqual(MoEPlatform.IOS);
            expect(result.data.clickAction).toEqual({});
            expect(result.data.clickAction.payload).toBeUndefined();
        });

        it('Android push without navigation action should deliver no click action', () => {
            const handler = jest.fn();
            executeHandler(handler, { [MOE_PAYLOAD]: pushClickedWithoutActionAndroidPayload }, PUSH_CLICKED);
            expect(handler).toHaveBeenCalledTimes(1);
            const result = handler.mock.calls[0][0];
            expect(result).toBeInstanceOf(MoEPushPayload);
            expect(result.platform).toEqual(MoEPlatform.Android);
            expect(result.data.isDefaultAction).toBe(true);
            expect(result.data.clickAction).toBeUndefined();
        });
    });
});

import "ts-jest";
import "jest";
import { getEnumByName } from "../internal/utils/Util";
import ActionType from "../model/enums/ActionType";
import NavigationType from "../model/enums/NavigationType";
import SyncType from "../model/enums/SyncType";
import TemplateType from "../model/enums/TemplateType";
import WidgetType from "../model/enums/WidgetType";

describe('Utils', () => {
    describe('Enum Value Check', () => {
        describe('ActionType', () => {
            it('enum value in small caps should return valid navigate ActionType', () => {
                expect(getEnumByName<ActionType>(ActionType, "navigate")).toEqual(ActionType.NAVIGATE);
            });

            it('enum value in upper caps should return valid navigate ActionType', () => {
                expect(getEnumByName<ActionType>(ActionType, "NAVIGATE")).toEqual(ActionType.NAVIGATE);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<ActionType>(ActionType, "invalid")).toEqual(undefined);
            });
        });

        describe('NavigationType', () => {
            it('enum value should return valid NavigationType as deeplink', () => {
                expect(getEnumByName<NavigationType>(NavigationType, "deeplink")).toEqual(NavigationType.DEEPLINK);
            });

            it('enum value should return valid NavigationType as richlanding', () => {
                expect(getEnumByName<NavigationType>(NavigationType, "richlanding")).toEqual(NavigationType.RICHLANDING);
            });

            it('enum value should return valid NavigationType as screenname', () => {
                expect(getEnumByName<NavigationType>(NavigationType, "screenname")).toEqual(NavigationType.SCREENNAME);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<NavigationType>(NavigationType, "invalid")).toEqual(undefined);
            });
        });

        describe('SyncType', () => {
            it('enum value should return valid SyncType as APP_OPEN', () => {
                expect(getEnumByName<SyncType>(SyncType, "app_open")).toEqual(SyncType.APP_OPEN);
            });


            it('enum value should return valid SyncType as INBOX_OPEN', () => {
                expect(getEnumByName<SyncType>(SyncType, "inbox_open")).toEqual(SyncType.INBOX_OPEN);
            });

            it('enum value should return valid SyncType as PULL_TO_REFRESH', () => {
                expect(getEnumByName<SyncType>(SyncType, "pull_to_refresh")).toEqual(SyncType.PULL_TO_REFRESH);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<SyncType>(SyncType, "inboxopen")).toEqual(undefined);
            });
        });

        describe('TemplateType', () => {
            it('enum value should return valid TemplateType as BASIC', () => {
                expect(getEnumByName<TemplateType>(TemplateType, "basic")).toEqual(TemplateType.BASIC);
            });

            it('enum value should return valid TemplateType as ILLUSTRATION', () => {
                expect(getEnumByName<TemplateType>(TemplateType, "illustration")).toEqual(TemplateType.ILLUSTRATION);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<SyncType>(SyncType, "basic")).toEqual(undefined);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<TemplateType>(TemplateType, "invalid")).toEqual(undefined);
            });
        });

        describe('WidgetType', () => {
            it('enum value should return valid TemplateType as IMAGE', () => {
                expect(getEnumByName<WidgetType>(WidgetType, "image")).toEqual(WidgetType.IMAGE);
            });

            it('enum value should return valid TemplateType as TEXT', () => {
                expect(getEnumByName<WidgetType>(WidgetType, "text")).toEqual(WidgetType.TEXT);
            });

            it('enum value should return valid TemplateType as BUTTON', () => {
                expect(getEnumByName<WidgetType>(WidgetType, "button")).toEqual(WidgetType.BUTTON);
            });

            it('invalid enum value', () => {
                expect(getEnumByName<WidgetType>(WidgetType, "invalid")).toEqual(undefined);
            });
        });
    });
});
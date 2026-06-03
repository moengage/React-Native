// Filename: src/internal/MoEngage<featureNameCamel>Handler.ts
import { NativeEventEmitter } from "react-native";
import { MoEngageLogger } from "react-native-moengage";
import <rnBridgeName> from '../NativeMoEngage<featureNameCamel>';
import { MODULE_TAG, event<EventName>, keyData, keyPayload } from "./Constants";
import { get<Entity>FromPayload } from "./utils/PayloadParser";
import { get<EventModel>FromJson } from "./utils/JsonToModelMapper";
import { getAccountMetaPayload, get<MethodName>Payload } from "./utils/PayloadBuilder";

let MoEngageEventEmitter: any;

/**
 * Connects public <featureNameCamel> APIs to the native bridge.
 *
 * @since 1.0.0
 * @author <Your Name>
 */
class MoEngage<featureNameCamel>Handler {

    private TAG = `${MODULE_TAG}MoEngage<featureNameCamel>Handler`;
    private appId: string;

    constructor(appId: string) {
        this.appId = appId;
    }

    // ── FIRE-AND-FORGET ──────────────────────────────────────────────────────
    <methodName>(<params>): void {
        try {
            <rnBridgeName>.<methodName>(get<MethodName>Payload(this.appId /*, <params> */));
            MoEngageLogger.verbose(`${this.TAG} Executed - <methodName>()`);
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} <methodName>() `, error);
        }
    }

    // ── PROMISE ──────────────────────────────────────────────────────────────
    async <methodName>(<params>): Promise<<ReturnType>> {
        try {
            const resultPayload = await <rnBridgeName>.<methodName>(
                get<MethodName>Payload(this.appId /*, <params> */)
            );
            const result = get<Entity>FromPayload(resultPayload);
            MoEngageLogger.verbose(`${this.TAG} Executed - <methodName>() `, result);
            return result ?? <defaultValue>;
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} <methodName>() `, error);
            return <defaultValue>;
        }
    }

    // ── EVENT LISTENER INIT (only when nativeToHybrid events exist) ──────────
    initialize(on<EventName>: (data: <EventModel> | null) => void): void {
        try {
            if (<rnBridgeName> && MoEngageEventEmitter === undefined) {
                MoEngageEventEmitter = new NativeEventEmitter(<rnBridgeName>);
                MoEngageEventEmitter.addListener(
                    event<EventName>,
                    (data: any) => this.handle<EventName>Callback(data, on<EventName>)
                );
            }
        } catch (error) {
            MoEngageLogger.error(`${this.TAG} initialize() `, error);
        }
    }

    private handle<EventName>Callback(
        data: { [k: string]: any },
        callback: (data: <EventModel> | null) => void
    ): void {
        try {
            const payload = data[keyPayload];
            const dataJson = JSON.parse(payload)[keyData];
            const result = dataJson ? get<EventModel>FromJson(dataJson) : null;
            callback(result);
        } catch (error) {
            MoEngageLogger.error(`handle<EventName>Callback() `, error);
        }
    }
}

export default MoEngage<featureNameCamel>Handler;

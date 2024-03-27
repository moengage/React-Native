export function getAppIdJson(appId: String) {
    let json: { [k: string]: any } = {
        accountMeta: {
            appId: appId
        }
    }
    return JSON.stringify(json);
}
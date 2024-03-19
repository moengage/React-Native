export function getAppIdJson(appId: String) {
    var json: { [k: string]: any } = {
        accountMeta: {
            appId: appId
        }
    }
    return json;
}
import { categoriesArray, defaultColor, defaultSize } from "./ModelClassProvider";

export const appId = "DummyAppId"

/****************************** Common Json Payload ******************************/

export const appIdPayload = {
    "appId": appId
}

export const campaignPayloadJson = {
    "id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
    "platform": "android",
    "status": "show",
    "created_at": 1686215892,
    "updated_at": 1686215892,
    "meta_data": {
        "moe_campaign_id": "000000000001686215892586",
        "moe_campaign_type": "cards",
        "moe_campaign_channel": "Cards",
        "moe_delivery_type": "One Time",
        "cid": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0",
        "moe_card_id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
        "moe_campaign_name": "MoEngageDemoAppMoeTest-TestCardCampaign"
    },
    "template_data": {
        "type": "illustration",
        "containers": [
            {
                "widgets": [
                    {
                        "content": "https://picsum.photos/400/200",
                        "type": "image",
                        "id": 0
                    },
                    {
                        "content": "<div>Header</div>",
                        "type": "text",
                        "id": 1
                    },
                    {
                        "content": "<div>Message</div>",
                        "type": "text",
                        "id": 2
                    },
                    {
                        "content": "<div><strong><em>CTA Text</em></strong></div>",
                        "type": "button",
                        "id": 3,
                        "actions": [
                            {
                                "type": "screenName",
                                "name": "navigate",
                                "value": "com.moengage.sampleapp.ui.activity.ConfigurationActivity",
                                "kvPairs": {}
                            }
                        ]
                    }
                ],
                "style": {
                    "bgColor": "#ffffff"
                },
                "type": "illustration",
                "id": 0,
                "actions": []
            }
        ],
        "batch_no": 0
    },
    "user_activity": {
        "is_clicked": false
    },
    "display_controls": {
        "expire_at": 1688807892
    },
    "category": "Announcements"
}

/****************************** Action Json Payload ******************************/

export const screenNameActionJson = {
    "name": "NAVIGATE",
    "type": "SCREENNAME",
    "value": "com.moengage.sampleapp.ui.activity.ConfigurationActivity",
    "kvPairs": {}
}

export const deeplinkActionJson = {
    "name": "NAVIGATE",
    "type": "DEEPLINK",
    "value": "https://google.com",
    "kvPairs": {}
}

export const richLandingActionJson = {
    "name": "NAVIGATE",
    "type": "RICHLANDING",
    "value": "https://google.com",
    "kvPairs": {}
}

/****************************** Style Json Payload ******************************/

export const styleWithoutKeyJson = {
}

export const styleWithSizeAndColorJson = {
    "bgColor": defaultColor,
    "fontSize": defaultSize
}

export const styleWithColorJson = {
    "bgColor": defaultColor
}

/****************************** CampaignState Json Payload ******************************/
export const campaignStateJson = {
    "localShowCount": 0,
    "isClicked": false,
    "firstReceived": 14545545,
    "firstSeen": 12333566,
    "totalShowCount": 10
}

export const campaignStateWithoutKeyJson = {
}

/****************************** Widget Json Payload ******************************/
export const buttonWidgetWithoutStyleJson = {
    "id": 3,
    "content": "<div><strong><em>CTA Text</em></strong></div>",
    "type": "BUTTON",
    "actions": [
        screenNameActionJson
    ],
    "accessibility":undefined
}

export const buttonWidgetWithStyleJson = {
    "id": 3,
    "content": "<div><strong><em>CTA Text</em></strong></div>",
    "type": "BUTTON",
    "style": styleWithSizeAndColorJson,
    "actions": [
        screenNameActionJson
    ],
    "accessibility":undefined
}

export const textWidgetWithoutStylJson = {
    "id": 2,
    "content": "<div>Message</div>",
    "type": "TEXT",
    "actions": [
        deeplinkActionJson
    ],
    "accessibility":undefined
}

export const textWidgetWithStyleJson = {
    "id": 2,
    "content": "<div>Message</div>",
    "type": "TEXT",
    "style": styleWithSizeAndColorJson,
    "actions": [
        deeplinkActionJson
    ],
    "accessibility":undefined
}

export const imageWidgetWithoutStylJson = {
    "id": 0,
    "content": "https://picsum.photos/400/200",
    "type": "IMAGE",
    "actions": [
        richLandingActionJson
    ],
    "accessibility": {
        "text": "text",
        "hint": "hint"
    }
}

export const imageWidgetWithStyleJson = {
    "id": 0,
    "content": "https://picsum.photos/400/200",
    "type": "IMAGE",
    "style": styleWithColorJson,
    "actions": [
        richLandingActionJson
    ],
    "accessibility": {
        "text": "text",
        "hint": "hint"
    }
}

/****************************** Container Json Payload ******************************/
export const illustrationContainerJson = {
    "id": 0,
    "type": "ILLUSTRATION",
    "style": styleWithColorJson,
    "widgets": [
        imageWidgetWithStyleJson,
        textWidgetWithStyleJson,
        buttonWidgetWithStyleJson
    ],
    "actions": [
        richLandingActionJson
    ]
}

export const illustrationContainerWithoutStyleJson = {
    "id": 0,
    "type": "ILLUSTRATION",
    "widgets": [
        imageWidgetWithoutStylJson,
        textWidgetWithoutStylJson,
        buttonWidgetWithoutStyleJson
    ],
    "actions": [
        richLandingActionJson
    ]
}

export const basicContainerJson = {
    "id": 0,
    "type": "BASIC",
    "style": styleWithColorJson,
    "widgets": [
        imageWidgetWithStyleJson,
        textWidgetWithStyleJson,
        buttonWidgetWithStyleJson
    ],
    "actions": [
        richLandingActionJson
    ]
}

export const basicContainerWithoutStyleJson = {
    "id": 0,
    "type": "BASIC",
    "widgets": [
        imageWidgetWithoutStylJson,
        textWidgetWithoutStylJson,
        buttonWidgetWithoutStyleJson
    ],
    "actions": [
        richLandingActionJson
    ]
}

/****************************** Template Json Payload ******************************/
export const illustrationTemplateJson = {
    "type": "ILLUSTRATION",
    "containers": [
        illustrationContainerJson
    ],
    "kvPairs": {}
}

export const basicTemplateJson = {
    "type": "BASIC",
    "containers": [
        basicContainerJson
    ],
    "kvPairs": {}
}

/****************************** ShowTime Json Payload ******************************/
export const showTimeWithEmptyValueJson = {
    "start_time": "",
    "end_time": ""
}

export const showTimeWithValidValueJson = {
    "start_time": "10:00",
    "end_time": "12:00"
}

/****************************** DisplayControl Json Payload ******************************/
export const displayControlJson = {
    "expire_at": 1688807892,
    "expire_after_seen": -1,
    "expire_after_delivered": -1,
    "max_times_to_show": -1,
    "is_pin": false,
    "show_time": showTimeWithValidValueJson
}

export const displayControlWithoutKeyJson = {}

/****************************** MetaData Json Payload ******************************/
export const metaDataJson = {
    "is_pin": false,
    "isNewCard": false,
    "campaignState": campaignStateJson,
    "deletionTime": 1688807892,
    "display_controls": displayControlJson,
    "metaData": {
        "moe_campaign_type": "cards",
        "moe_campaign_name": "MoEngageDemoAppMoeTest-TestCardCampaign",
        "moe_card_id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
        "moe_campaign_id": "000000000001686215892586",
        "moe_campaign_channel": "Cards",
        "moe_delivery_type": "One Time",
        "cid": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0"
    },
    "updated_at": 1686215892,
    "created_at": 1686215892,
    "campaignPayload": campaignPayloadJson
}

/****************************** Card Json Payload ******************************/
export const illustrationCardJson = {
    "id": 5,
    "card_id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
    "category": "Announcements",
    "template_data": illustrationTemplateJson,
    "meta_data": metaDataJson
}

export const basicCardJson = {
    "id": 5,
    "card_id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
    "category": "Announcements",
    "template_data": basicTemplateJson,
    "meta_data": metaDataJson
}


/****************************** CardsInfo Json Payload ******************************/
export const cardInfoJson = {
    "shouldShowAllTab": true,
    "categories": categoriesArray,
    "cards": [illustrationCardJson, basicCardJson],
    "accessibility": {
        "pinned_card": {
            "text": "pinned_card",
            "hint": "pinned_card"
        },
        "no_cards": {
            "text": "no_cards", 
            "hint": "no_cards"
        },
        "place_holder": {
            "text": "place_holder",
            "hint": "place_holder"
        }
    }       
}


/****************************** CardsData Json Payload ******************************/
export const cardDataJson = {
    "category": "Announcements",
    "cards": [illustrationCardJson, basicCardJson],
    "accessibility": {
        "pinned_card": {
            "text": "pinned_card",
            "hint": "pinned_card"
        },
        "no_cards": {
            "text": "no_cards", 
            "hint": "no_cards"
        },
        "place_holder": {
            "text": "place_holder",
            "hint": "place_holder"
        }
    }
}


/****************************** SyncCompleteData Json Payload ******************************/
export const syncCompleteDataPullToRefreshJson = {
    "hasUpdates": true,
    "syncType": "PULL_TO_REFRESH"
}

export const syncCompleteDataAppOpenJson = {
    "hasUpdates": true,
    "syncType": "APP_OPEN"
}

export const syncCompleteDataInboxOpenJson = {
    "hasUpdates": true,
    "syncType": "INBOX_OPEN"
}

/****************************** Hybrid To Native Payload ******************************/
export const accountMetaJson = {
    "accountMeta": appIdPayload
};

export const deleteCardJson = {
    "accountMeta": appIdPayload,
    "data": {
        "cards": [
            illustrationCardJson
        ]
    }
}

export const getCardsForCategoryJson = {
    "accountMeta": appIdPayload,
    "data": {
        "category": "Announcements"
    }
}

export const cardShowJson = {
    "accountMeta": appIdPayload,
    "data": {
        "card": illustrationCardJson
    }
}

export const cardClickedJson = {
    "accountMeta": appIdPayload,
    "data": {
        "card": illustrationCardJson,
        "widgetId": -1,
    }
}

/****************************** Native To Hybrid Payload ******************************/
export const allCategoryEnabledJson = {
    "accountMeta": appIdPayload,
    "data": {
        "isAllCategoryEnabled": true
    }
}

export const cardsCategoriesJson = {
    "accountMeta": appIdPayload,
    "data": {
        "categories": categoriesArray
    }
}

export const cardsForCategoryJson = {
    "accountMeta": appIdPayload,
    "data": {
        "category": "Announcements",
        "cards": [
            illustrationCardJson
        ]
    }
}

export const cardsDataJson = {
    "accountMeta": appIdPayload,
    "data": {
        "category": 'Announcements',
        "cards": [
            illustrationCardJson,
            basicCardJson
        ],
        "accessibility": {
            "pinned_card": {
                "text": "pinned_card",
                "hint": "pinned_card"
            },
            "no_cards": {
                "text": "no_cards", 
                "hint": "no_cards"
            },
            "place_holder": {
                "text": "place_holder",
                "hint": "place_holder"
            }
        }
    }
}

export const cardsInfoJson = {
    "accountMeta": appIdPayload,
    "data": {
        "shouldShowAllTab": true,
        "categories": categoriesArray,
        "cards": [
            illustrationCardJson,
            basicCardJson
        ],
        "accessibility": {
            "pinned_card": {
                "text": "pinned_card",
                "hint": "pinned_card"
            },
            "no_cards": {
                "text": "no_cards", 
                "hint": "no_cards"
            },
            "place_holder": {
                "text": "place_holder",
                "hint": "place_holder"
            }
        }
    }
}

export const newCardCountJson = {
    "accountMeta": appIdPayload,
    "data": {
        "newCardsCount": 10
    }
}

export const syncCardJson = {
    "accountMeta": appIdPayload,
    "data": {
        "syncCompleteData": syncCompleteDataPullToRefreshJson
    }
}

export const unclickedCountJson = {
    "accountMeta": appIdPayload,
    "data": {
        "unClickedCardsCount": 10
    }
}
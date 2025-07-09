import CampaignState from "../model/CampaignState";
import Card from "../model/Card";
import CardInfo from "../model/CardInfo";
import CardsData from "../model/CardsData";
import Container from "../model/Container";
import DisplayControl from "../model/DisplayControl";
import MetaData from "../model/MetaData";
import ShowTime from "../model/ShowTime";
import SyncCompleteData from "../model/SyncData";
import Template from "../model/Template";
import Widget from "../model/Widget";
import NavigationAction from "../model/action/NavigationAction";
import ActionType from "../model/enums/ActionType";
import NavigationType from "../model/enums/NavigationType";
import SyncType from "../model/enums/SyncType";
import TemplateType from "../model/enums/TemplateType";
import WidgetType from "../model/enums/WidgetType";
import ButtonStyle from "../model/styles/ButtonStyle";
import ContainerStyle from "../model/styles/ContainerStyle";
import ImageStyle from "../model/styles/ImageStyle";
import TextStyle from "../model/styles/TextStyle";

export const defaultColor = "#C0C0C0";
export const defaultSize = 32;
export const categoriesArray = ['Announcements', 'Promotions_new'];
import { MoEAccessibilityData } from "react-native-moengage";
/****************************** Action Object ******************************/
export const screenNavigationActionObject = new NavigationAction(
    ActionType.NAVIGATE,
    NavigationType.SCREENNAME,
    "com.moengage.sampleapp.ui.activity.ConfigurationActivity",
    {}
);

export const deeplinkNavigationActionObject = new NavigationAction(
    ActionType.NAVIGATE,
    NavigationType.DEEPLINK,
    "https://google.com",
    {}
);

export const richNavigationActionObject = new NavigationAction(
    ActionType.NAVIGATE,
    NavigationType.RICHLANDING,
    "https://google.com",
    {}
);


/****************************** Style Object ******************************/
export const buttonStyleObject = new ButtonStyle(defaultColor, defaultSize);

export const containerStyleObject = new ContainerStyle(defaultColor);

export const imageStyleObject = new ImageStyle(defaultColor);

export const textStyleObject = new TextStyle(defaultColor, defaultSize);

export const defaultButtonStyleObject = new ButtonStyle(defaultColor, defaultSize);

export const defaultContainerStyleObject = new ContainerStyle(defaultColor);

export const defaultImageStyleObject = new ImageStyle(defaultColor);

export const defaultTextStyleObject = new TextStyle(defaultColor, defaultSize);


/****************************** Campaign Object ******************************/
export const campaignStateObject = new CampaignState(
    0,
    false,
    14545545,
    12333566,
    10
)

export const campaignStateWithDefaultObject = new CampaignState(
    0,
    false,
    -1,
    -1,
    0
)


/****************************** Widget Object ******************************/
export const imageWidgetWithoutStyleObject = new Widget(
    0,
    WidgetType.IMAGE,
    "https://picsum.photos/400/200",
    undefined,
    [richNavigationActionObject],
    new MoEAccessibilityData('text', 'hint')
);

export const imageWidgeWithStyleObject = new Widget(
    0,
    WidgetType.IMAGE,
    "https://picsum.photos/400/200",
    imageStyleObject,
    [richNavigationActionObject],
    new MoEAccessibilityData('text', 'hint')
);

export const textWidgetWithoutStyleObject = new Widget(
    2,
    WidgetType.TEXT,
    "<div>Message</div>",
    undefined,
    [deeplinkNavigationActionObject],
    null
);

export const textWidgetWithStyleObject = new Widget(
    2,
    WidgetType.TEXT,
    "<div>Message</div>",
    textStyleObject,
    [deeplinkNavigationActionObject],
    null
);

export const buttonWidgetWithoutStyleObject = new Widget(
    3,
    WidgetType.BUTTON,
    "<div><strong><em>CTA Text</em></strong></div>",
    undefined,
    [screenNavigationActionObject],
    null
);

export const buttonWidgetWithStyleObject = new Widget(
    3,
    WidgetType.BUTTON,
    "<div><strong><em>CTA Text</em></strong></div>",
    buttonStyleObject,
    [screenNavigationActionObject],
    null
);


/****************************** Container Object ******************************/
export const illustrationContainerWithStyleObject = new Container(
    0,
    TemplateType.ILLUSTRATION,
    containerStyleObject,
    [imageWidgeWithStyleObject, textWidgetWithStyleObject, buttonWidgetWithStyleObject],
    [richNavigationActionObject]
)

export const illustrationContainerWithoutStyleObject = new Container(
    0,
    TemplateType.ILLUSTRATION,
    undefined,
    [imageWidgetWithoutStyleObject, textWidgetWithoutStyleObject, buttonWidgetWithoutStyleObject],
    [richNavigationActionObject]
)

export const basicContainerWithStyleObject = new Container(
    0,
    TemplateType.BASIC,
    containerStyleObject,
    [imageWidgeWithStyleObject, textWidgetWithStyleObject, buttonWidgetWithStyleObject],
    [richNavigationActionObject]
)

export const basicContainerWithoutStyleObject = new Container(
    0,
    TemplateType.BASIC,
    undefined,
    [imageWidgetWithoutStyleObject, textWidgetWithoutStyleObject, buttonWidgetWithoutStyleObject],
    [richNavigationActionObject]
)


/****************************** Template Object ******************************/
export const illustrationTemplateObject = new Template(
    TemplateType.ILLUSTRATION,
    [illustrationContainerWithStyleObject],
    {}
)

export const basicTemplateObject = new Template(
    TemplateType.BASIC,
    [basicContainerWithStyleObject],
    {}
)


/****************************** ShowTime Object ******************************/
export const showTimeWithoutValueObject = new ShowTime(
    "",
    ""
)

export const showTimeWithValueObject = new ShowTime(
    "10:00",
    "12:00"
)


/****************************** DisplayControl Object ******************************/
export const displayControlObject = new DisplayControl(
    1688807892,
    -1,
    -1,
    -1,
    false,
    showTimeWithValueObject
)


/****************************** MetaData Object ******************************/
export const metaDataObject = new MetaData(
    false,
    false,
    campaignStateObject,
    1688807892,
    displayControlObject,
    {
        "moe_campaign_type": "cards",
        "moe_campaign_name": "MoEngageDemoAppMoeTest-TestCardCampaign",
        "moe_card_id": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
        "moe_campaign_id": "000000000001686215892586",
        "moe_campaign_channel": "Cards",
        "moe_delivery_type": "One Time",
        "cid": "000000000001686215892586_F_T_CA_AB_0_P_0_L_0"
    },
    1686215892,
    1686215892,
    {
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
)


/****************************** SyncCompleteData Object ******************************/
export const syncCompleteDataPullToRefreshObject = new SyncCompleteData(
    true,
    SyncType.PULL_TO_REFRESH
)

export const syncCompleteDataAppOpenObject = new SyncCompleteData(
    true,
    SyncType.APP_OPEN
)

export const syncCompleteDataInboxOpenObject = new SyncCompleteData(
    true,
    SyncType.INBOX_OPEN
)


/****************************** Card Object ******************************/
export const illustrationCardObject = new Card(
    5,
    "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
    "Announcements",
    illustrationTemplateObject,
    metaDataObject
)

export const basicCardObject = new Card(
    5,
    "000000000001686215892586_F_T_CA_AB_0_P_0_L_0_android",
    "Announcements",
    basicTemplateObject,
    metaDataObject
)

/****************************** CardsInfo Object ******************************/
export const cardsInfoObject = new CardInfo(
    true,
    categoriesArray,
    [illustrationCardObject, basicCardObject],
    {
        pinned_card: new MoEAccessibilityData('pinned_card', 'pinned_card'),
        no_cards: new MoEAccessibilityData('no_cards', 'no_cards'),
        place_holder: new MoEAccessibilityData('place_holder', 'place_holder')  
    }
)


/****************************** CardsData Object ******************************/
export const cardsDataObject = new CardsData(
    "Announcements",
    [illustrationCardObject, basicCardObject],
    {
        pinned_card: new MoEAccessibilityData('pinned_card', 'pinned_card'),
        no_cards: new MoEAccessibilityData('no_cards', 'no_cards'),
        place_holder: new MoEAccessibilityData('place_holder', 'place_holder')  
    }
)
import UIKit
import UserNotifications
import UserNotificationsUI
import MoEngageRichNotification

class NotificationViewController: UIViewController, UNNotificationContentExtension {
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    func didReceive(_ notification: UNNotification) {
        MoEngageSDKRichNotification.addPushTemplate(toController: self, withNotification: notification)
    }
}

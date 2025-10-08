import clsx from "clsx";
import {updateNotification} from "@/utils/firestore";

export default function NotificationsList({ notifications }) {

    const onClick = async (notification) => {
        await updateNotification(notification.id, {
            read: true,
        })
    }

    const formatTime = (timestamp) => {
        // Format time as "X minutes/hours/days ago"
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diff = now - notificationTime;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }

    const getNotificationDisplay = (notification) => {
        if (notification.type === "submission") {
            return <>
                <div className={ "flex justify-between gap-2"}>
                    <div className={clsx(
                        "w-2 h-2 rounded-full mt-1.5",
                        !notification.read ? "bg-blue-500" : "bg-transparent"
                    )}></div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-secondary"> Assignment submitted</p>
                        <p className="text-sm text-tertiary">{notification.message}</p>
                    </div>
                    <p className="text-sm text-gray-400 text-right">{formatTime(notification.createdAt)}</p>
                </div>
            </>
        }
    }

    return (
        <div className="">
            <ul>
                {notifications.map((n) => (
                    <li key={n.id} className="border-b border-gray-200 py-2" onClick={() => onClick(n)}>
                        {getNotificationDisplay(n)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
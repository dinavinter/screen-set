import React from "react";
import { List } from "@mui/material";

import NotificationListItem from "./NotificationListItem";
import {NotificationResponseItem} from "../machines/notificationsMachine";

export interface NotificationsListProps {
  notifications: NotificationResponseItem[];
  updateNotification: Function;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  updateNotification,
}) => {
  return (
    <>
      {notifications?.length > 0 ? (
        <List data-test="notifications-list">
          {notifications.map((notification: NotificationResponseItem) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              updateNotification={updateNotification}
            />
          ))}
        </List>
      ) : (
        <></>
      )}
    </>
  );
};

export default NotificationsList;

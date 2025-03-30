import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { NotificationType } from 'delib-npm';
import { updateArray } from '@/controllers/general/helpers';

// Define a type for the slice state
interface NotificationsState {
	inAppNotifications: NotificationType[];
}

// Define the initial state using that type
const initialState: NotificationsState = {
	inAppNotifications: [],
};

export const notificationsSlicer = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		setInAppNotificationsAll: (state, action: PayloadAction<NotificationType[]>) => {
			try {
				state.inAppNotifications = action.payload;
			} catch (error) {
				console.error(error);
			}
		},
		setInAppNotifications: (
			state,
			action: PayloadAction<NotificationType[]>
		) => {
			try {
				action.payload.forEach((notification) => {
					state.inAppNotifications = updateArray(
						state.inAppNotifications,
						notification,
						'notificationId'
					);
				});
			} catch (error) {
				console.error(error);
			}
		},
		setInAppNotification: (
			state,
			action: PayloadAction<NotificationType>
		) => {
			try {
				state.inAppNotifications = updateArray(
					state.inAppNotifications,
					action.payload,
					'notificationId'
				);
			} catch (error) {
				console.error(error);
			}
		},
		deleteInAppNotification: (state, action: PayloadAction<string>) => {
			try {
				state.inAppNotifications = state.inAppNotifications.filter(
					(notification) =>
						notification.notificationId !== action.payload
				);
			} catch (error) {
				console.error(error);
			}
		},
		deleteInAppNotificationsByParentId: (
			state,
			action: PayloadAction<string>
		) => {
			try {
				state.inAppNotifications = state.inAppNotifications.filter(
					(notification) => notification.parentId !== action.payload
				);
			} catch (error) {
				console.error(error);
			}
		},
	},
});

export const {
	setInAppNotificationsAll,
	setInAppNotification,
	setInAppNotifications,
	deleteInAppNotification,
	deleteInAppNotificationsByParentId,
} = notificationsSlicer.actions;

// Other code such as selectors can use the imported `RootState` type
export const inAppNotificationsSelector = (state: RootState) =>
	state.notifications.inAppNotifications;

export const inAppNotificationsCountSelectorForStatement = (statementId: string) => (state: RootState) => state.notifications.inAppNotifications.filter(notification => notification.parentId === statementId);

export default notificationsSlicer.reducer;

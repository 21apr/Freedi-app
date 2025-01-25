import { Notification } from './Notification';

export default function validateNotification(
	notification: unknown
): notification is Notification {
	if (!notification || typeof notification !== 'object') return false;
	const n = notification as Notification;

	return (
		typeof n.userId === 'string' &&
		typeof n.parentId === 'string' &&
		typeof n.text === 'string' &&
		typeof n.creatorName === 'string' &&
		typeof n.createdAt === 'number' &&
		typeof n.read === 'boolean' &&
		typeof n.notificationId === 'string' &&
		(!n.parentStatement || typeof n.parentStatement === 'string') &&
		(!n.creatorImage ||
			n.creatorImage === null ||
			typeof n.creatorImage === 'string')
	);
}

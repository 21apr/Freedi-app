export interface Notification {
	userId: string;
	parentId: string;
	parentStatement?: string;
	text: string;
	creatorName: string;
	creatorImage?: string | null;
	createdAt: number;
	read: boolean;
	notificationId: string;
}

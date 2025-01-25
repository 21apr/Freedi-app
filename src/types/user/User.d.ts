export interface User {
	displayName: string;
	uid: string;
	defaultLanguage?: string;
	email?: string | null;
	photoURL?: string | null;
	isAnonymous?: boolean;
	fontSize?: number | null;
	color?: string;
	agreement?: Agreement | null;
	role?: string;
}

export interface Agreement {
	text: string;
	date: number;
	version: string;
}

export enum Role {
	admin = 'admin',
	member = 'member',
	banned = 'banned',
	unsubscribed = 'unsubscribed',
	creator = 'statement-creator',
}

export interface UserData {
	userId: string;
	email?: string;
	displayName?: string;
	city?: string;
	country?: string;
	dateOfBirth?: number;
}

export interface StatementSubscriptionNotification {
	statementId: string;
	userId: string;
	subscribed: boolean;
	token: string;
	notification?: boolean;
}

export interface StatementSubscription {
	role: Role;
	userId: string;
	statementId: string;
	lastUpdate: number;
	createdAt?: number;
	statementsSubscribeId: string;
	statement: Statement;
	notification: boolean;
	token?: string[];
	totalSubStatementsRead?: number;
	user: User;
	userAskedForNotification: boolean;
}

export enum DocumentType {
	paragraph = 'paragraph',
	section = 'section',
	comment = 'comment',
}

export enum DeliberationType {
	chat = 'chat',
	options = 'options',
	voting = 'voting',
}

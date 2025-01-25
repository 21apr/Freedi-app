export interface SimpleStatement {
	statementId: string;
	statement: string;
	description?: string;
	creatorId: string;
	creator: {
		displayName: string;
		uid: string;
		defaultLanguage?: string;
		email?: string | null;
		photoURL?: string | null;
		isAnonymous?: boolean;
		fontSize?: number | null;
		color?: string;
		agreement?: {
			text: string;
			date: number;
			version: string;
		} | null;
		role?: string;
	};
	parentId: string;
	consensus: number;
	voted?: number;
}

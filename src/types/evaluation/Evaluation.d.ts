export interface Evaluation {
	parentId: string;
	evaluationId: string;
	statementId: string;
	evaluatorId: string;
	updatedAt: number;
	evaluation: number;
	evaluator?: {
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
	};
}

export interface Evaluator {
	evaluatorId?: string;
	statementId?: string;
	evaluated?: boolean;
	suggested?: boolean;
	firstEvaluation?: boolean;
	secondEvaluation?: boolean;
	voted?: boolean;
}

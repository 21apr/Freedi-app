export interface Agree {
	agree?: number;
	disagree?: number;
	avgAgree?: number;
}

export enum AgreeDisagreeEnum {
	Agree = 'agree',
	Disagree = 'disagree',
	NoOpinion = 'noOpinion',
}

export interface AgreeDisagree {
	agreeId: string;
	statementId: string;
	documentId: string;
	topParentId: string;
	userId: string;
	agree: number;
}

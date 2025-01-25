export interface Statement {
	statement: string;
	statementId: string;
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
	statementType: StatementType;
	parentId: string;
	parents?: string[];
	topParentId: string;
	hasChildren?: boolean;
	lastMessage?: string;
	lastUpdate: number;
	lastChildUpdate?: number;
	createdAt: number;
	pro?: number;
	con?: number;
	consensus: number;
	order?: number;
	votes?: number;
	voted?: number;
	totalSubStatements?: number;
	description?: string;
	defaultLanguage?: string;
	evaluation?: {
		agreement: number;
		sumEvaluations: number;
		numberOfEvaluators: number;
		sumPro?: number;
		sumCon?: number;
	};
	totalEvaluators?: number;
	isInMultiStage?: boolean;
	viewed?: {
		individualViews?: number;
	};
	membership?: {
		adminApproveMembers?: boolean;
		access?: Access;
		typeOfMembersAllowed?: membersAllowed;
	};
	statementSettings?: {
		show?: boolean;
		hasChildren?: boolean;
		subScreens?: Array<Screen>;
		enableAddEvaluationOption?: boolean;
		enableAddVotingOption?: boolean;
		enhancedEvaluation?: boolean;
		showEvaluation?: boolean;
		inVotingGetOnlyResults?: boolean;
		enableSimilaritiesSearch?: boolean;
		enableNotifications?: boolean;
		enableNavigationalElements?: boolean;
		deliberationType?: DeliberationType;
		hasChat?: boolean;
	};
	stageType?: StageType;
	stageId?: string | null;
}

export enum Access {
	open = 'open',
	close = 'close',
}

export enum membersAllowed {
	all = 'all',
	nonAnonymous = 'nonAnonymous',
}

export enum StatementType {
	statement = 'statement',
	option = 'option',
	question = 'question',
	document = 'document',
	group = 'group',
	stage = 'stage',
}

export enum DeliberativeElement {
	explanation = 'explanation',
	needs = 'needs',
	resource = 'resource',
	consideration = 'consideration',
	research = 'research',
	option = 'option',
	general = 'general',
}

export enum ValidationType {
	Number = 'number',
	String = 'string',
	Boolean = 'boolean',
}

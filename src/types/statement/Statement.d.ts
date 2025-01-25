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
	deliberativeElement?: DeliberativeElement;
	color?: string;
	followMe?: string;
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
	doc?: {
		isDoc: boolean;
		order: number;
	};
	evaluation?: {
		agreement: number;
		sumEvaluations: number;
		numberOfEvaluators: number;
		sumPro?: number;
		sumCon?: number;
	};
	consensus: number;
	order?: number;
	elementHight?: number;
	top?: number;
	votes?: number;
	selections?: any;
	isSelected?: boolean;
	importanceData?: {
		sumImportance: number;
		numberOfUsers: number;
		numberOfViews: number;
	};
	voted?: number;
	totalSubStatements?: number;
	description?: string;
	defaultLanguage?: string;
	totalEvaluators?: number;
	isInMultiStage?: boolean;
	documentSettings?: {
		parentDocumentId: string;
		order: number;
		type: DocumentType;
		isTop: boolean;
	};
	documentApproval?: DocumentApproval;
	documentImportance?: DocumentImportance;
	documentAgree?: Agree;
	viewed?: {
		individualViews?: number;
	};
	stageId?: string | null;
	stageType?: StageType;
	creatorData?: UserData;
	isChosen?: boolean;
	chosenSolutions?: string[];
	summary?: string;
	steps?: {
		currentStep: Step;
		allSteps?: Step[];
	};
	questionSettings?: QuestionSettings;
	membership?: Membership;
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
	resultsSettings?: {
		resultsBy: ResultsBy;
		cutoffNumber?: number;
		numberOfResults?: number;
		numberOfSelections?: number;
		deep?: number;
		minConsensus?: number;
	};
	results?: SimpleStatement[];
	isResult?: boolean;
	imagesURL?: {
		main?: string;
		more?: string[];
	};
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

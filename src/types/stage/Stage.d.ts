import { Statement } from '../statement/Statement';

export class StageClass {
	private basicStagesTypes: StageType[] = [
		StageType.explanation,
		StageType.questions,
		StageType.suggestions,
		StageType.voting,
		StageType.summary,
	];

	public createBasicStages(statement: Statement): Statement[] {
		return this.basicStages(statement);
	}

	private createStage(statement: Statement, stageType: StageType): Statement {
		return {
			...statement,
			stageType,
			statement: this.convertToStageTitle(stageType),
		};
	}

	public convertToStageTitle(stageType: StageType | undefined): string {
		switch (stageType) {
			case StageType.explanation:
				return 'Explanation';
			case StageType.questions:
				return 'Questions';
			case StageType.needs:
				return 'Needs';
			case StageType.suggestions:
				return 'Suggestions';
			case StageType.hypothesis:
				return 'Hypothesis';
			case StageType.voting:
				return 'Voting';
			case StageType.conclusion:
				return 'Conclusion';
			case StageType.summary:
				return 'Summary';
			case StageType.other:
				return 'Other';
			default:
				return '';
		}
	}

	public get getBasicStagesTypes(): StageType[] {
		return this.basicStagesTypes;
	}

	basicStages(statement: Statement): Statement[] {
		return this.basicStagesTypes.map((type) =>
			this.createStage(statement, type)
		);
	}
}

export enum StageType {
	explanation = 'explanation',
	questions = 'questions',
	needs = 'needs',
	suggestions = 'suggestions',
	hypothesis = 'hypothesis',
	voting = 'voting',
	conclusion = 'conclusion',
	summary = 'summary',
	other = 'other',
}

export enum QuestionStagesType {
	singleStage = 'singleStage',
	document = 'document',
}

export enum QuestionStage {
	explanation = 'explanation',
	suggestion = 'suggestion',
	firstEvaluation = 'firstEvaluation',
	secondEvaluation = 'secondEvaluation',
	voting = 'voting',
	finished = 'finished',
}

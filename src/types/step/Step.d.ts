export enum StepType {
	chat = 'chat',
	options = 'options',
	addOptions = 'addOptions',
	randomOptions = 'randomOptions',
	topOptions = 'topOptions',
	voting = 'voting',
}

export interface Step {
	stepId: string;
	stepType: StepType;
	instructions?: string;
	duration?: number;
	endTime?: number;
	order?: number;
}

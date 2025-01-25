import { Step, StepType } from './Step';

export default function validateStep(step: unknown): step is Step {
	if (!step || typeof step !== 'object') return false;
	const s = step as Step;

	return (
		typeof s.stepId === 'string' &&
		Object.values(StepType).includes(s.stepType) &&
		(!s.instructions || typeof s.instructions === 'string') &&
		(!s.duration || typeof s.duration === 'number') &&
		(!s.endTime || typeof s.endTime === 'number') &&
		(!s.order || typeof s.order === 'number')
	);
}

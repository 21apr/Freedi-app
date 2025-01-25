import { StageType } from './Stage';

export default function validateStageType(type: unknown): type is StageType {
	return (
		typeof type === 'string' &&
		Object.values(StageType).includes(type as StageType)
	);
}

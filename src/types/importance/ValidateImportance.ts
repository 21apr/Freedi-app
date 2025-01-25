import { Importance } from './Importance';

export default function validateImportance(imp: unknown): imp is Importance {
	if (!imp || typeof imp !== 'object') return false;
	const i = imp as Importance;

	return (
		typeof i.topParentId === 'string' &&
		typeof i.documentId === 'string' &&
		typeof i.parentId === 'string' &&
		typeof i.statementId === 'string' &&
		typeof i.importance === 'number' &&
		typeof i.userId === 'string'
	);
}

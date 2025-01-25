import { Statement, ValidationType } from './Statement';

export function validateStatement(statement: unknown): statement is Statement {
	if (!statement || typeof statement !== 'object') return false;
	const s = statement as any;

	const requiredStringFields: Array<keyof Statement> = [
		'statement',
		'statementId',
		'creatorId',
		'parentId',
		'topParentId',
	];
	if (!requiredStringFields.every((field) => typeof s[field] === 'string'))
		return false;

	if (!s.creator?.displayName || !s.creator.uid) return false;

	if (
		!['statement', 'option', 'question', 'document', 'group', 'stage'].includes(
			s.statementType
		)
	) {
		return false;
	}

	if (
		typeof s.lastUpdate !== 'number' ||
		typeof s.createdAt !== 'number' ||
		typeof s.consensus !== 'number'
	)
		return false;

	return true;
}

export function validate<T>(value: unknown, type: ValidationType): T {
	switch (type) {
		case 'number':
			if (typeof value !== 'number')
				throw new Error(`Expected number, got ${typeof value}`);
			return value as T;
		case 'string':
			if (typeof value !== 'string')
				throw new Error(`Expected string, got ${typeof value}`);
			return value as T;
		case 'boolean':
			if (typeof value !== 'boolean')
				throw new Error(`Expected boolean, got ${typeof value}`);
			return value as T;
		default:
			throw new Error(`Unknown type: ${type}`);
	}
}

export function safeParse<T>(
	value: unknown,
	type: ValidationType
): { success: boolean; value?: T } {
	try {
		const validated = validate<T>(value, type);
		return { success: true, value: validated };
	} catch {
		return { success: false };
	}
}

export function maxKeyInObject(obj: { [key: string]: number }): string {
	return Object.keys(obj).reduce(
		(a, b) => (obj[a] > obj[b] ? a : b),
		Object.keys(obj)[0]
	);
}

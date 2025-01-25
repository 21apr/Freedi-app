import { Collections } from './Collection';

export function validateCollection(
	collection: unknown
): collection is Collections {
	return (
		typeof collection === 'string' &&
		Object.values(Collections).includes(collection as Collections)
	);
}

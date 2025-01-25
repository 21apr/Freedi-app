import { Results } from 'delib-npm';
import { validateStatement } from '../statement/ValidateStatement';

export function validateResults(results: unknown): results is Results {
	if (!results || typeof results !== 'object') return false;
	const r = results as Results;

	return (
		validateStatement(r.top) &&
		Array.isArray(r.sub) &&
		r.sub.every(validateResults)
	);
}

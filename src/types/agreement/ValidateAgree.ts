import { Agree, AgreeDisagree } from './Agree';

export function validateAgree(agree: unknown): agree is Agree {
	if (!agree || typeof agree !== 'object') return false;
	const a = agree as Agree;
	return (
		(!a.agree || typeof a.agree === 'number') &&
		(!a.disagree || typeof a.disagree === 'number') &&
		(!a.avgAgree || typeof a.avgAgree === 'number')
	);
}

export function validateAgreeDisagree(ad: unknown): ad is AgreeDisagree {
	if (!ad || typeof ad !== 'object') return false;
	const a = ad as AgreeDisagree;

	return (
		typeof a.agreeId === 'string' &&
		typeof a.statementId === 'string' &&
		typeof a.documentId === 'string' &&
		typeof a.topParentId === 'string' &&
		typeof a.userId === 'string' &&
		typeof a.agree === 'number'
	);
}

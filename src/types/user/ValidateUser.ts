import { Agreement, User, UserData } from './User';

export function validateUser(user: unknown): user is User {
	if (!user || typeof user !== 'object') return false;
	const u = user as User;

	if (typeof u.displayName !== 'string' || typeof u.uid !== 'string')
		return false;

	// Optional fields validation
	if (u.defaultLanguage && typeof u.defaultLanguage !== 'string') return false;
	if (u.color && typeof u.color !== 'string') return false;
	if (u.fontSize && typeof u.fontSize !== 'number') return false;
	if (u.role && typeof u.role !== 'string') return false;
	if (u.isAnonymous && typeof u.isAnonymous !== 'boolean') return false;

	if (u.agreement && !validateAgreement(u.agreement)) return false;

	return true;
}

export function validateAgreement(agreement: unknown): agreement is Agreement {
	if (!agreement || typeof agreement !== 'object') return false;
	const a = agreement as Agreement;

	return (
		typeof a.text === 'string' &&
		typeof a.date === 'number' &&
		typeof a.version === 'string'
	);
}
export function validateUserData(data: unknown): data is UserData {
	if (!data || typeof data !== 'object') return false;
	const d = data as UserData;

	if (typeof d.userId !== 'string') return false;
	if (d.email && typeof d.email !== 'string') return false;
	if (d.displayName && typeof d.displayName !== 'string') return false;
	if (d.city && typeof d.city !== 'string') return false;
	if (d.country && typeof d.country !== 'string') return false;
	if (d.dateOfBirth && typeof d.dateOfBirth !== 'number') return false;

	return true;
}

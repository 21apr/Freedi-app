import { Role } from '../User';
import { validateAgreement } from '../ValidateUser';
import { UserSettings } from './UserSettings';

interface ValidationResult {
	isValid: boolean;
	learning: boolean;
	agreement: boolean;
}

function checkBasicFields(settings: any): ValidationResult {
	if (!settings || typeof settings !== 'object') {
		return { isValid: false, learning: false, agreement: false };
	}

	const basicFieldsValid =
		typeof settings.userId === 'string' &&
		(!settings.fontSize || typeof settings.fontSize === 'number') &&
		(!settings.color || typeof settings.color === 'string') &&
		(!settings.defaultLanguage ||
			typeof settings.defaultLanguage === 'string') &&
		(!settings.role || Object.values(Role).includes(settings.role));

	return {
		isValid: basicFieldsValid,
		learning: !!settings.learning,
		agreement: !!settings.agreement,
	};
}

export function validateUserSettings(
	settings: unknown
): settings is UserSettings {
	const result = checkBasicFields(settings as any);
	if (!result.isValid) return false;

	const s = settings as UserSettings;

	if (result.learning && !validateLearning(s.learning)) return false;
	if (result.agreement && !validateAgreement(s.agreement)) return false;

	return true;
}

function validateLearning(learning?: UserSettings['learning']): boolean {
	if (!learning) return true;
	return (
		(!learning.evaluation || typeof learning.evaluation === 'number') &&
		(!learning.addOptions || typeof learning.addOptions === 'number')
	);
}

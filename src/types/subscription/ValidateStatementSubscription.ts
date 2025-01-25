import { User } from '../user/User';
import { StatementSubscription } from './StatementSubscription';

export default function validateStatementSubscription(
	sub: unknown
): sub is StatementSubscription {
	if (!sub || typeof sub !== 'object') return false;
	const s = sub as StatementSubscription;

	return (
		typeof s.userId === 'string' &&
		typeof s.statementId === 'string' &&
		typeof s.lastUpdate === 'number' &&
		typeof s.statementsSubscribeId === 'string' &&
		(!s.createdAt || typeof s.createdAt === 'number') &&
		(!s.token || Array.isArray(s.token)) &&
		(!s.totalSubStatementsRead ||
			typeof s.totalSubStatementsRead === 'number') &&
		typeof s.notification === 'boolean' &&
		typeof s.userAskedForNotification === 'boolean'
	);
}

export function getStatementSubscriptionId(
	statementId: string,
	user: User
): string | undefined {
	try {
		if (!user || !user.uid) throw new Error('No user');
		if (!statementId) throw new Error('No statementId');

		return `${user.uid}--${statementId}`;
	} catch (error) {
		console.error(error);

		return undefined;
	}
}

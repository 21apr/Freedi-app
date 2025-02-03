import { useState, useEffect } from 'react';
import { getStatementFromDB } from '../db/statements/getStatement';
import { getTopParentSubscriptionFromDByStatement } from '../db/subscriptions/getSubscriptions';
import { setStatementSubscriptionToDB } from '../db/subscriptions/setSubscriptions';
import { useAppSelector } from './reduxHooks';
import {
	statementSelector,
	statementSubscriptionSelector,
} from '@/model/statements/statementsSlice';
import { store } from '@/model/store';
import { Access } from '@/types/enums';
import { Statement } from '@/types/statement';
import { StatementSubscription } from '@/types/statement/subscription';
import { Role } from '@/types/user';

const useAuth = () => {
	const [isLogged, setIsLogged] = useState(false);
	const user = store.getState().user.user;
	useEffect(() => {
		if (user) setIsLogged(true);
		else setIsLogged(false);
	}, [user]);

	return isLogged;
};

export default useAuth;

export function useIsAuthorized(statementId: string | undefined): {
	isAuthorized: boolean;
	loading: boolean;
	statementSubscription: StatementSubscription | undefined;
	statement: Statement | undefined;
	topParentStatement: Statement | undefined;
	role: Role | undefined;
	error: boolean;
} {
	//TODO:create a check with the parent statement if subscribes. if not subscribed... go according to the rules of authorization

	const statementSubscription = useAppSelector(
		statementSubscriptionSelector(statementId)
	);
	const role = statementSubscription?.role || Role.unsubscribed;
	const statement = useAppSelector(statementSelector(statementId));
	const [topParentStatement, setTopParentStatement] = useState<
		Statement | undefined
	>(undefined);
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		if (!statement) return;

		// if statment close, and !member or admin -> show password

		isAuthorizedFn(statement, statementSubscription).then((_isAuthorized) => {
			if (_isAuthorized) {
				setIsAuthorized(true);
				setLoading(false);
			} else {
				setIsAuthorized(false);
				setLoading(false);
				setError(true);
			}
		});
	}, [statement, statementSubscription]);

	useEffect(() => {
		if (!statement) return;
		if (!topParentStatement)
			getStatementFromDB(statement.topParentId).then((_topParentStatement) => {
				if (_topParentStatement) {
					setTopParentStatement(_topParentStatement);
				}
			});
	}, [statement, topParentStatement]);

	return {
		isAuthorized,
		loading,
		statementSubscription,
		statement,
		topParentStatement,
		error,
		role,
	};
}

async function isAuthorizedFn(
	statement: Statement | undefined,
	statementSubscription: StatementSubscription | undefined
): Promise<boolean> {
	try {
		if (!statement) return false;

		//in case the statement is open
		if (
			statement.membership?.access === Access.open &&
			statementSubscription?.role !== Role.banned
		) {
			if (!statementSubscription) {
				setStatementSubscriptionToDB(statement, Role.member);
			}

			return true;

			//if the statement is close
		} else if (statement.membership?.access === Access.close) {
			//if the user is the creator or admin or member allow
			if (isAllowed(statement, statementSubscription?.role)) {
				return true;
			} else {
				//if the user is not subscribed to the statement, but subscribed to the top parent statement allow
				const parentSubscription =
					await getTopParentSubscriptionFromDByStatement(statement);
				if (isAllowed(statement, parentSubscription?.role)) {
					return true;
				}

				return false;
			}
		}

		return false;
	} catch (e) {
		console.error(e);

		return false;
	}
}

function isAllowed(statement: Statement, role?: Role): boolean {
	if (
		role === Role.admin ||
		role === Role.member ||
		statement.creatorId === store.getState().user.user?.uid
	) {
		return true;
	} else {
		return false;
	}
}

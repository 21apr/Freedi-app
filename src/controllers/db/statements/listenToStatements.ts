import { Unsubscribe } from 'firebase/auth';
import {
	and,
	collection,
	doc,
	limit,
	onSnapshot,
	or,
	orderBy,
	query,
	where,
} from 'firebase/firestore';

// Redux Store
import { FireStore } from '../config';
import {
	deleteStatement,
	removeMembership,
	setMembership,
	setStatement,
	setStatementSubscription,
	setStatements,
} from '@/redux/statements/statementsSlice';
import { AppDispatch, store } from '@/redux/store';
import {
	Collections,
	StatementType,
	DeliberativeElement,
} from '@/types/TypeEnums';
import { Statement, StatementSchema } from '@/types/statement/Statement';
import { StatementSubscription } from '@/types/statement/StatementSubscription';
import { User } from '@/types/user/User';
import { parse } from 'valibot';
import React from 'react';
import { Role } from '@/types/user/UserSettings';

// Helpers

export const listenToStatementSubscription = (
	statementId: string,
	user: User,
	dispatch: AppDispatch
): Unsubscribe => {
	try {
		const statementsSubscribeRef = doc(
			FireStore,
			Collections.statementsSubscribe,
			`${user.uid}--${statementId}`
		);

		return onSnapshot(statementsSubscribeRef, (statementSubscriptionDB) => {
			try {
				if (!statementSubscriptionDB.exists()) {
					console.info('No subscription found');

					return;
				}
				const statementSubscription =
					statementSubscriptionDB.data() as StatementSubscription;

				const { role } = statementSubscription;

				//@ts-ignore
				if (role === 'statement-creator') {
					statementSubscription.role = Role.admin;
				} else if (role === undefined) {
					statementSubscription.role = Role.unsubscribed;
					console.info(
						'Role is undefined. Setting role to unsubscribed'
					);
				}

				dispatch(setStatementSubscription(statementSubscription));
			} catch (error) {
				console.error(error);
			}
		});
	} catch (error) {
		console.error(error);

		return () => {};
	}
};

export const listenToStatement = (
	statementId: string | undefined,
	setIsStatementNotFound?: React.Dispatch<React.SetStateAction<boolean>>
): Unsubscribe => {
	try {
		const dispatch = store.dispatch;
		if (!statementId) throw new Error('Statement id is undefined');
		const statementRef = doc(
			FireStore,
			Collections.statements,
			statementId
		);

		return onSnapshot(
			statementRef,
			(statementDB) => {
				try {
					if (!statementDB.exists()) {
						if (setIsStatementNotFound)
							setIsStatementNotFound(true);
						throw new Error('Statement does not exist');
					}
					const statement = statementDB.data() as Statement;

					dispatch(setStatement(statement));
				} catch (error) {
					console.error(error);
					if (setIsStatementNotFound) setIsStatementNotFound(true);
				}
			},
			(error) => console.error(error)
		);
	} catch (error) {
		console.error(error);
		if (setIsStatementNotFound) setIsStatementNotFound(true);

		return () => {};
	}
};

export const listenToSubStatements = (
	statementId: string | undefined
): Unsubscribe => {
	try {
		const dispatch = store.dispatch;
		if (!statementId) throw new Error('Statement id is undefined');
		const statementsRef = collection(FireStore, Collections.statements);
		const q = query(
			statementsRef,
			where('parentId', '==', statementId),
			where('statementType', '!=', StatementType.document),
			orderBy('createdAt', 'desc'),
			limit(100)
		);
		let isFirstCall = true;

		return onSnapshot(q, (statementsDB) => {
			const startStatements: Statement[] = [];
			statementsDB.docChanges().forEach((change) => {
				const statement = change.doc.data() as Statement;

				if (change.type === 'added') {
					if (isFirstCall) {
						startStatements.push(statement);
					} else {
						dispatch(setStatement(statement));
					}
				}

				if (change.type === 'modified') {
					dispatch(setStatement(statement));
				}

				if (change.type === 'removed') {
					dispatch(deleteStatement(statement.statementId));
				}

				// There shouldn't be deleted statements. instead the statement should be updated to status "deleted".
				// If You will use delete, it will remove from the dom a messages that are outside of the limit of the query.
			});
			isFirstCall = false;

			dispatch(setStatements(startStatements));
		});
	} catch (error) {
		console.error(error);

		return () => {};
	}
};

export const listenToMembers =
	(dispatch: AppDispatch) => (statementId: string) => {
		try {
			const membersRef = collection(
				FireStore,
				Collections.statementsSubscribe
			);
			const q = query(
				membersRef,
				where('statementId', '==', statementId),
				where('statement.statementType', '!=', StatementType.document),
				orderBy('createdAt', 'desc')
			);

			return onSnapshot(q, (subsDB) => {
				subsDB.docChanges().forEach((change) => {
					const member = change.doc.data() as StatementSubscription;
					if (change.type === 'added') {
						dispatch(setMembership(member));
					}

					if (change.type === 'modified') {
						dispatch(setMembership(member));
					}

					if (change.type === 'removed') {
						dispatch(
							removeMembership(member.statementsSubscribeId)
						);
					}
				});
			});
		} catch (error) {
			console.error(error);
		}
	};

export async function listenToUserAnswer(
	questionId: string,
	cb: (statement: Statement) => void
) {
	try {
		const user = store.getState().user.user;
		if (!user) throw new Error('User not logged in');
		const statementsRef = collection(FireStore, Collections.statements);
		const q = query(
			statementsRef,
			where('statementType', '==', StatementType.option),
			where('parentId', '==', questionId),
			where('creatorId', '==', user.uid),
			orderBy('createdAt', 'desc'),
			limit(1)
		);

		return onSnapshot(q, (statementsDB) => {
			statementsDB.docChanges().forEach((change) => {
				const statement = parse(StatementSchema, change.doc.data());

				cb(statement);
			});
		});
	} catch (error) {
		console.error(error);
	}
}

export async function listenToChildStatements(
	dispatch: AppDispatch,
	statementId: string,
	callback: (childStatements: Statement[]) => void
): Promise<Unsubscribe | null> {
	try {
		const statementsRef = collection(FireStore, Collections.statements);
		const q = query(
			statementsRef,
			and(
				or(
					where(
						'deliberativeElement',
						'==',
						DeliberativeElement.option
					),
					where(
						'deliberativeElement',
						'==',
						DeliberativeElement.research
					)
				),
				where('parents', 'array-contains', statementId)
			)
		);

		const unsubscribe = onSnapshot(q, (statementsDB) => {
			const childStatements: Statement[] = [];

			statementsDB.forEach((doc) => {
				const childStatement = doc.data() as Statement;
				childStatements.push(childStatement);
				dispatch(setStatement(childStatement));
			});

			callback(childStatements);
		});

		return unsubscribe;
	} catch (error) {
		console.error(error);

		return null;
	}
}

export function listenToAllSubStatements(
	statementId: string,
	numberOfLastMessages = 7
) {
	try {
		if (numberOfLastMessages > 25) numberOfLastMessages = 25;
		if (!statementId) throw new Error('Statement id is undefined');

		const statementsRef = collection(FireStore, Collections.statements);
		const q = query(
			statementsRef,
			where('topParentId', '==', statementId),
			where('statementId', '!=', statementId),
			orderBy('createdAt', 'desc'),
			limit(numberOfLastMessages)
		);

		return onSnapshot(q, (statementsDB) => {
			statementsDB.docChanges().forEach((change) => {
				const statement = parse(StatementSchema, change.doc.data());

				if (statement.statementId === statementId) return;

				switch (change.type) {
					case 'added':
						store.dispatch(setStatement(statement));
						break;
					case 'removed':
						store.dispatch(deleteStatement(statement.statementId));
						break;
				}
			});
		});
	} catch (error) {
		console.error(error);

		return (): void => {
			return;
		};
	}
}
export function listenToAllDescendants(statementId: string): Unsubscribe {
	try {
		const statementsRef = collection(FireStore, Collections.statements);
		const q = query(
			statementsRef,
			and(
				or(
					where(
						'deliberativeElement',
						'==',
						DeliberativeElement.option
					),
					where(
						'deliberativeElement',
						'==',
						DeliberativeElement.research
					)
				),
				where('parents', 'array-contains', statementId)
			),
			limit(100)
		);

		return onSnapshot(q, (statementsDB) => {
			statementsDB.docChanges().forEach((change) => {
				const statement = parse(StatementSchema, change.doc.data());

				if (
					change.type === 'added' ||
					change.type === 'modified' ||
					change.type === 'removed'
				) {
					store.dispatch(setStatement(statement));
				}
			});
		});
	} catch (error) {
		console.error(error);

		return (): void => {
			return;
		};
	}
}

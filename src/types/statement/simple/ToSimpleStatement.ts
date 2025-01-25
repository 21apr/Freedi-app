import { Statement } from '@/types/statement/Statement';
import { SimpleStatement } from './SimpleStatement';

export function statementToSimpleStatement(
	statement: Statement
): SimpleStatement {
	return {
		statementId: statement.statementId,
		statement: statement.statement,
		description: statement.description,
		creatorId: statement.creatorId,
		creator: statement.creator,
		parentId: statement.parentId,
		consensus: statement.consensus,
		voted: statement.voted,
	};
}

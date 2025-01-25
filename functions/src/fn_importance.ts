import { logger } from 'firebase-functions/v1';
import { db } from '.';
import { FieldValue } from 'firebase-admin/firestore';
import { Importance } from '../../src/types/importance/Importance';
import { Collections } from '../../src/types/collection/Collection';
import { Statement } from '../../src/types/statement/Statement';

export async function setImportanceToStatement(event: any) {
	try {
		const importanceBeforeData = event.data.before.data() as
			| Importance
			| undefined;
		const importanceAfterData = event.data.after.data() as
			| Importance
			| undefined;
		const statementId =
			importanceBeforeData?.statementId || importanceAfterData?.statementId;
		if (!statementId) throw new Error('No statement id found');

		const diffNumberOfUsers = (() => {
			if (importanceBeforeData && importanceAfterData) return 0;
			if (importanceBeforeData) return -1;
			if (importanceAfterData) return 1;
			return 0;
		})();

		let importanceBefore = 0;
		let importanceAfter = 0;
		if (importanceBeforeData)
			importanceBefore = importanceBeforeData.importance;
		if (importanceAfterData) importanceAfter = importanceAfterData.importance;

		//get section id
		const sectionId =
			importanceBeforeData?.parentId || importanceAfterData?.parentId;
		if (!sectionId) throw new Error('No section id found');

		//get all user importance ratings in the section
		const importanceList = await db
			.collection(Collections.importance)
			.where('parentId', '==', sectionId)
			.get();

		let totalImportance = 0;

		importanceList.forEach((imp) => {
			const impData = imp.data() as Importance;
			totalImportance += impData.importance;
		});

		const diffImportance = importanceAfter - importanceBefore;

		//update statement importance
		const statementRef = db.collection(Collections.statements).doc(statementId);

		//get previous statement data
		const statement = await statementRef.get();
		const statementData = statement.data();
		if (!statementData) throw new Error('No statement data found');
		const { documentImportance } = statementData as Statement;
		const currentSumImportance = documentImportance?.sumImportance || 0;
		const currentNumberOfUsers = documentImportance?.numberOfUsers || 0;
		const averageImportance =
			(currentSumImportance + diffImportance) /
			(currentNumberOfUsers + diffNumberOfUsers);

		await statementRef.set(
			{
				documentImportance: {
					sumImportance: FieldValue.increment(diffImportance),
					numberOfUsers: FieldValue.increment(diffNumberOfUsers),
					averageImportance,
				},
			},
			{ merge: true }
		);

		return;
	} catch (error) {
		logger.error(error);
		return;
	}
}

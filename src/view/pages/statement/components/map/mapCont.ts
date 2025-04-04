import { getResultsDB } from '@/controllers/db/results/getResults';
import { DeliberativeElement } from '@/types/TypeEnums';
import { ResultsBy, Results } from '@/types/results/Results';
import { Statement } from '@/types/statement/Statement';

export async function getResults(
	statement: Statement,
	subStatements: Statement[],
	resultsBy: ResultsBy,
	numberOfResults: number
): Promise<Results> {
	try {
		const result: Results = { top: statement, sub: [] };

		if (resultsBy === ResultsBy.topOptions) {
			result.sub = [
				...getResultsByOptions(subStatements, numberOfResults),
			];
		} else {
			result.sub = [];
		}

		const subResultsPromises = result.sub.map(
			async (subResult: Results) => {
				const subStatement = subResult.top;
				const subResults: Statement[] =
					await getResultsDB(subStatement);

				return subResults;
			}
		);

		const resultsStatements = await Promise.all(subResultsPromises);

		result.sub.forEach((_: Results, index: number) => {
			if (!result.sub) return;
			result.sub[index].sub = [
				...resultsStatements[index].map((subStatement: Statement) => ({
					top: subStatement,
					sub: [],
				})),
			];
		});

		return result;
	} catch (error) {
		console.error(error);

		return { top: statement, sub: [] };
	}
}
function getResultsByOptions(
	subStatements: Statement[],
	numberOfResults: number
): Results[] {
	try {
		const maxOptions: Statement[] = subStatements
			.filter((s) => s.deliberativeElement === DeliberativeElement.option)
			.sort((b, a) => a.consensus - b.consensus)
			.slice(0, numberOfResults || 1);

		const _maxOptions = maxOptions.map((topStatement: Statement) => ({
			top: topStatement,
			sub: [],
		}));

		return _maxOptions;
	} catch (error) {
		console.error(error);

		return [];
	}
}

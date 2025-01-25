import { ChoseBy, ChoseByEvaluationType, CutoffType } from './ChoseBy';

export function validateChoseBy(settings: unknown): settings is ChoseBy {
	if (!settings || typeof settings !== 'object') return false;
	const s = settings as ChoseBy;

	return (
		typeof s.statementId === 'string' &&
		Object.values(CutoffType).includes(s.cutoffType) &&
		Object.values(ChoseByEvaluationType).includes(s.choseByEvaluationType) &&
		typeof s.number === 'number'
	);
}

export function defaultChoseBySettings(statementId: string): ChoseBy {
	return {
		number: 1,
		cutoffType: CutoffType.topOptions,
		choseByEvaluationType: ChoseByEvaluationType.consensus,
		statementId: statementId,
	};
}

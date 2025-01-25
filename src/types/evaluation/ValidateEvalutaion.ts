import { Evaluation } from '@/model/evaluations/evaluationModel';
import { Evaluator } from './Evaluation';

export function validateEvaluation(
	evaluation: unknown
): evaluation is Evaluation {
	if (!evaluation || typeof evaluation !== 'object') return false;
	const e = evaluation as Evaluation;

	return (
		typeof e.parentId === 'string' &&
		typeof e.evaluationId === 'string' &&
		typeof e.statementId === 'string' &&
		typeof e.evaluatorId === 'string' &&
		typeof e.updatedAt === 'number' &&
		typeof e.evaluation === 'number'
	);
}

export function validateEvaluator(evaluator: unknown): evaluator is Evaluator {
	if (!evaluator || typeof evaluator !== 'object') return false;
	const e = evaluator as Evaluator;

	return (
		(!e.evaluatorId || typeof e.evaluatorId === 'string') &&
		(!e.statementId || typeof e.statementId === 'string') &&
		(!e.evaluated || typeof e.evaluated === 'boolean') &&
		(!e.suggested || typeof e.suggested === 'boolean') &&
		(!e.firstEvaluation || typeof e.firstEvaluation === 'boolean') &&
		(!e.secondEvaluation || typeof e.secondEvaluation === 'boolean') &&
		(!e.voted || typeof e.voted === 'boolean')
	);
}

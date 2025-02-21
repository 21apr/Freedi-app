import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import Dot from './dot/Dot';
import styles from './Triangle.module.scss';
import { useUserConfig } from '@/controllers/hooks/useUserConfig';
import { statementOptionsSelector } from '@/redux/statements/statementsSlice';
import { Statement } from '@/types/statement/Statement';

interface Props {
	statement: Statement;
}

const Triangle: FC<Props> = ({ statement }) => {
	const { t } = useUserConfig();
	const subStatements: Statement[] = useSelector(
		statementOptionsSelector(statement.statementId)
	).filter((s: Statement) => s.evaluation?.sumCon !== undefined);

	let maxEvaluators = 0;
	subStatements.forEach((subStatement: Statement) => {
		if (
			subStatement.evaluation?.numberOfEvaluators !== undefined &&
			subStatement.evaluation?.numberOfEvaluators > maxEvaluators
		)
			maxEvaluators = subStatement.evaluation.numberOfEvaluators;
	});

	return (
		<>
			<div className={styles.triangle}></div>
			<div
				className={`${styles.triangle} ${styles['triangle--invisible']}`}
			>
				{subStatements.map((subStatement: Statement) => {
					return (
						<Dot
							key={subStatement.statementId}
							subStatement={subStatement}
							maxEvaluators={maxEvaluators}
						/>
					);
				})}
				<span className={styles.xAxis}>{t('Agreements')}</span>
				<span className={styles.yAxis}>{t('Objections')}</span>
				<span className={styles.conflicts}>{t('Conflicts')}</span>
				<span className={styles.abstention}>{t('Abstention')}</span>
			</div>
		</>
	);
};

export default memo(Triangle);

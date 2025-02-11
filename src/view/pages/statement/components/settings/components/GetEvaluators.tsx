import React, { FC } from 'react';
import { handleGetEvaluators } from '../statementSettingsCont';
import MembersChipsList from './membership/membersChipsList/MembersChipList';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import { Evaluation } from '@/types/evaluation/evaluationTypes';
import { User } from '@/types/user';

interface GetEvaluatorsProps {
	statementId: string;
}

const GetEvaluators: FC<GetEvaluatorsProps> = ({ statementId }) => {
	const { t } = useLanguage();

	const [evaluators, setEvaluators] = React.useState<Evaluation[]>([]);
	const [clicked, setClicked] = React.useState(false);

	const getEvaluations = () => {
		if (!clicked) {
			handleGetEvaluators(statementId, setEvaluators, setClicked);
		} else {
			setClicked(false);
		}
	};

	const members = evaluators.flatMap(
		(evaluator) => evaluator.evaluator as User
	);

	return (
		<>
			<button
				type='button'
				className='evaluators-button form-button'
				onClick={getEvaluations}
			>
				{t('Get Evaluators')}
			</button>

			{clicked && (
				<>
					{members.length > 0 && (
						<>
							<span>
								{evaluators.length} {t('Evaluated')}
							</span>
							<MembersChipsList members={members} />
						</>
					)}
					{members.length === 0 && <div>{t('No evaluators found')}</div>}
				</>
			)}
		</>
	);
};

export default GetEvaluators;

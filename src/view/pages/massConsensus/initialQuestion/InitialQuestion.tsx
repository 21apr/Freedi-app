import { useNavigate, useParams } from 'react-router';
import HeaderMassConsensus from '../headerMassConsensus/HeaderMassConsensus';
import TitleMassConsensus from '../TitleMassConsensus/TitleMassConsensus';
import { useLanguageParams } from '../useParamsLang/useLanguageParams';
import { useSelector } from 'react-redux';
import { statementSelector } from '@/redux/statements/statementsSlice';
import { useEffect } from 'react';
import { useInitialQuestion } from './InitialQuestionVM';
import { MassConsensusPageUrls } from '@/types/TypeEnums';
import Loader from '@/view/components/loaders/Loader';
import styles from './InitialQuestion.module.scss';
import { useUserConfig } from '@/controllers/hooks/useUserConfig';
import MassConsensusFooter from '../MassConsensusFooter/MassConsensusFooter';

const InitialQuestion = () => {
	const navigate = useNavigate();
	const { dir, lang } = useLanguageParams();
	const { statementId } = useParams<{ statementId: string }>();
	const statement = useSelector(statementSelector(statementId));
	const {
		handleSetInitialSuggestion,
		changeInput,
		ifButtonEnabled,
		ready,
		loading,
	} = useInitialQuestion();
	const { t } = useUserConfig();

	useEffect(() => {
		if (!statement) navigate(`/mass-consensus/${statementId}/introduction`);
	}, [statementId, navigate]);

	useEffect(() => {
		if (ready)
			navigate(
				`/mass-consensus/${statementId}/${MassConsensusPageUrls.similarSuggestions}?lang=${lang}`
			);
	}, [ready]);

	return (
		<div style={{ direction: dir }}>
			<HeaderMassConsensus
				title={t('offer a suggestion')}
				backTo={MassConsensusPageUrls.introduction}
			/>
			<TitleMassConsensus
				title={t('please suggest a sentance that will unite Israel')}
			/>
			<div
				className={styles.suggestionContainer}
				style={{ direction: dir }}
			>
				<h3>{t('Your description')}</h3>
				<input type='text' onChange={changeInput} />
			</div>
			<MassConsensusFooter
				goTo={MassConsensusPageUrls.randomSuggestions}
				onNext={handleSetInitialSuggestion}
				isNextActive={ifButtonEnabled}
			/>
			{loading && <Loader />}
		</div>
	);
};

export default InitialQuestion;

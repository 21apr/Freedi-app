import { SimpleStatement, Statement, StageClass } from 'delib-npm'
import { FC } from 'react'
import styles from './StageCard.module.scss';
import Button, { ButtonType } from '@/view/components/buttons/button/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/controllers/hooks/useLanguages';

interface Props {
	statement: Statement
}

const StageCard: FC<Props> = ({ statement }) => {
	const stageClass = new StageClass()
	const { t } = useLanguage()
	const navigate = useNavigate();

	const chosen = statement.results || []

	function suggestNewSuggestion(ev: React.MouseEvent<HTMLButtonElement>) {
		ev.stopPropagation()
		navigate(`/stage/${statement.statementId}`)
	}

	return (
		<div className={styles.card}>
			<h3>{t(statement.statement ? statement.statement : stageClass.convertToStageTitle(statement.stageType))}</h3>

			{chosen.length === 0 ? (<p>{t("No suggestion so far")}</p>) :
				<>
					<h4>{t("Selected Options")}</h4>
					<ul>
						{chosen.map((opt: SimpleStatement) => (
							<NavLink key={opt.statementId} to={`/stage/${opt.statementId}`}><li >{opt.statement}{opt.description ? ":" : ""} {opt.description}</li></NavLink>
						))}
					</ul>
				</>
			}
			<NavLink to={`/stage/${statement.statementId}`} ><p className={styles.seeMore}>See more...</p></NavLink>
			<div className="btns">
				<Button text="Add Suggestion" buttonType={ButtonType.SECONDARY} onClick={suggestNewSuggestion} />
			</div>
		</div>
	)
}

export default StageCard

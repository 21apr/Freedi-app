import { Statement, StatementType } from "delib-npm";
import { FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { sortSubStatements } from "../../statementsEvaluationCont";
import SuggestionCard from "./suggestionCard/SuggestionCard";
import styles from "./SuggestionCards.module.scss";
import { statementSubsSelector } from "@/model/statements/statementsSlice";
import { StatementContext } from "@/view/pages/statement/StatementCont";
import EmptyScreen from "../emptyScreen/EmptyScreen";

const SuggestionCards: FC = () => {
	const { sort } = useParams();
	const { statement } = useContext(StatementContext);

	const [totalHeight, setTotalHeight] = useState(0);

	const subStatements = useSelector(statementSubsSelector(statement?.statementId)).filter((sub: Statement) => sub.statementType === StatementType.option);

	useEffect(() => {
		const { totalHeight: _totalHeight } = sortSubStatements(
			subStatements,
			sort,
			30
		);
		setTotalHeight(_totalHeight);
	}, [sort]);


	useEffect(() => {
		const _totalHeight = subStatements.reduce((acc: number, sub: Statement) => {
			return acc + (sub.elementHight ?? 200) + 30;
		}, 0);
		setTotalHeight(_totalHeight);
		sortSubStatements(subStatements, sort, 30);
	}, [subStatements.length]);

	if (!subStatements) {
		return (
			<EmptyScreen
				setShowModal={() => {
					return;
				}}
			/>
		);
	}

	return (
		<div
			className={styles['suggestions-wrapper']}
			style={{ height: `${totalHeight + 100}px` }}
		>
			{subStatements?.map((statementSub: Statement) => {
				return (
					<SuggestionCard
						key={statementSub.statementId}
						parentStatement={statement}
						siblingStatements={subStatements}
						statement={statementSub}
					/>
				);
			})}
		</div>
	);
};

export default SuggestionCards;

import { ReactNode, useContext } from 'react';
import { useParams } from 'react-router';
import { StatementContext } from '../../StatementCont';
import Chat from '../chat/Chat';
import FollowMeToast from '../followMeToast/FollowMeToast';
import StatementSettings from '../settings/StatementSettings';
import GroupPage from '../statementTypes/group/GroupPage';
import styles from './Switch.module.scss';
import QuestionPage from '../statementTypes/question/QuestionPage';
import StagePage from '../statementTypes/stage/StagePage';
import { useSwitchMV } from './SwitchMV';
import { StatementType } from '@/types/TypeEnums';
import { Statement } from '@/types/statement/StatementTypes';
import { Role } from '@/types/user/UserSettings';
import Triangle from '../../../../components/triangle/Triangle';

const Switch = () => {
	const { statement, role } = useContext(StatementContext);
	const { parentStatement } = useSwitchMV();

	return (
		<main className='page__main'>

			<FollowMeToast />

			<div className={styles.header}>
				<h1>
					{statement?.statementType === StatementType.stage
						? parentStatement?.statement
						: statement?.statement}
				</h1>
			</div>
			<div className="wrapper">

				<SwitchScreen statement={statement} role={role} />

			</div>
		</main>
	);
};

interface SwitchScreenProps {
	statement: Statement | undefined;
	role: Role | undefined;
}

function SwitchScreen({
	statement,
	role,
}: Readonly<SwitchScreenProps>): ReactNode {
	let { screen } = useParams();
	const { hasChat } = statement?.statementSettings || { hasChat: false };

	//allowed screens
	const hasPermission = role === Role.admin;
	if (!hasPermission && screen === 'settings') {
		screen = 'main';
	}
	if (!hasChat && screen === 'chat') {
		screen = 'main';
	}

	switch (screen) {
		case 'agreement-map':
			return <Triangle />;
		case 'chat':
			return <Chat />;
		case 'settings':
			return <StatementSettings />;
		case 'main':
			return <SwitchStatementType statement={statement} />;
		default:
			return <SwitchStatementType statement={statement} />;
	}
}

function SwitchStatementType({
	statement,
}: Readonly<{
	statement: Statement | undefined;
}>): ReactNode {
	const statementType = statement?.statementType;

	switch (statementType) {
		case StatementType.group:
			return <GroupPage />;
		case StatementType.question:
			return <QuestionPage />;
		case StatementType.stage:
			return <StagePage />;
		default:
			return null;
	}
}

export default Switch;

import { Statement } from 'delib-npm';
import React, { FC, useState } from 'react';

// Third party imports
import { useLocation } from 'react-router-dom';

// Helpers
import StatementTopNav from '../nav/top/StatementTopNav';
import InvitePanel from './invitePanel/InvitePanel';
import { logOut } from '@/controllers/db/auth';
import toggleNotifications from '@/controllers/db/notifications/notificationsHelpers';

// Hooks

import { setFollowMeDB } from '@/controllers/db/statements/setStatements';
import { useLanguage } from '@/controllers/hooks/useLanguages';
import useNotificationPermission from '@/controllers/hooks/useNotificationPermission';
import useToken from '@/controllers/hooks/useToken';

interface Props {
	statement: Statement | undefined;
	topParentStatement: Statement | undefined;
	parentStatement?: Statement | undefined;
	setShowAskPermission?: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatementHeader: FC<Props> = ({
	statement,
	topParentStatement,
	parentStatement,
	setShowAskPermission,
}) => {
	// Hooks
	const { pathname } = useLocation();

	const token = useToken();

	const permission = useNotificationPermission(token);
	const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
	const [showInvitationPanel, setShowInvitationPanel] = useState(false);

	const { t, dir } = useLanguage();

	function handleShare() {
		const baseUrl = window.location.origin;

		const shareData = {
			title: t('FreeDi: Empowering Agreements'),
			text: t('Invited:') + statement?.statement,
			url: `${baseUrl}${pathname}`,
		};
		navigator.share(shareData);
		setIsHeaderMenuOpen(false);
	}

	async function handleFollowMe() {
		try {
			if (!topParentStatement) throw new Error('No top parent statement');

			await setFollowMeDB(topParentStatement, pathname);
		} catch (error) {
			console.error(error);
		} finally {
			setIsHeaderMenuOpen(false);
		}
	}
	function handleToggleNotifications() {
		toggleNotifications(statement, permission, t, setShowAskPermission);
		setIsHeaderMenuOpen(false);
	}

	function handleInvitePanel() {
		try {
			setShowInvitationPanel(true);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleLogout() {
		try {
			setIsHeaderMenuOpen(false);
			await logOut();
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className={`page__header ${dir}`}>
			<StatementTopNav
				statement={statement}
				parentStatement={parentStatement}
				handleShare={handleShare}
				handleFollowMe={handleFollowMe}
				handleToggleNotifications={handleToggleNotifications}
				handleInvitePanel={handleInvitePanel}
				handleLogout={handleLogout}
				setIsHeaderMenuOpen={setIsHeaderMenuOpen}
				permission={permission}
				isHeaderMenuOpen={isHeaderMenuOpen}
			/>
			{showInvitationPanel && (
				<InvitePanel
					setShowModal={setShowInvitationPanel}
					statementId={statement?.statementId}
					pathname={pathname}
				/>
			)}
		</div>
	);
};

export default StatementHeader;
import { Link, useParams } from 'react-router';
import BackIcon from '@/assets/icons/chevronLeftIcon.svg?react';
import HomeIcon from '@/assets/icons/homeIcon.svg?react';
import styles from './HeaderMassConsensus.module.scss';
import { MassConsensusPageUrls, Role } from 'delib-npm';
import { useUserConfig } from '@/controllers/hooks/useUserConfig';
import { useHeader } from './HeaderContext';
import { useSelector } from 'react-redux';
import { statementSubscriptionSelector } from '@/redux/statements/statementsSlice';

const HeaderMassConsensus = () => {
	const { statementId } = useParams<{ statementId: string }>();
	const { dir } = useUserConfig();
	const { title, backTo, backToApp, isIntro } = useHeader();
	const role = useSelector(statementSubscriptionSelector(statementId))?.role;

	const computedTitle = typeof title === 'function' ? title() : title;

	return (
		<div className={styles.headerMC} style={{ direction: dir }}>
			<div className={styles.headerMC__wrapper}>
				{isIntro ? (
					''
				) : (
					<Link
						className={
							dir === 'ltr'
								? styles.icon
								: `${styles.icon} ${styles['icon--ltr']}`
						}
						to={
							backToApp
								? `/statement/${statementId}`
								: `/mass-consensus/${statementId}/${backTo}`
						}
					>
						<BackIcon />
					</Link>
				)}
				<div
					className={styles['title-container']}
					style={{ direction: dir }}
				>
					<h1 className={styles.title}>{computedTitle}</h1>
				</div>

				{isIntro ? (
					''
				) : (
					<Link
						className={styles.icon}
							to={role === Role.admin ? `/statement/${statementId}`:`/mass-consensus/${statementId}/${MassConsensusPageUrls.introduction}`}
					>
						<HomeIcon />
					</Link>
				)}
			</div>
		</div>
	);
};

export default HeaderMassConsensus;

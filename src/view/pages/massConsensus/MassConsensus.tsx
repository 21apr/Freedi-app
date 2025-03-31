import { getStatementSubscriptionFromDB } from '@/controllers/db/subscriptions/getSubscriptions'
import { getStatementSubscriptionId } from '@/controllers/general/helpers'
import { useAuthentication } from '@/controllers/hooks/useAuthentication'
import { setStatementSubscription, statementSubscriptionSelector } from '@/redux/statements/statementsSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router'
import { HeaderProvider } from './headerMassConsensus/HeaderContext'
import HeaderMassConsensus from './headerMassConsensus/HeaderMassConsensus'
import styles from './MassConsensus.module.scss'
import { useUserConfig } from '@/controllers/hooks/useUserConfig'
import { setMassConsensusMemberToDB } from '@/controllers/db/massConsensus/setMassConsensus'
import { massConsensusStepsSelector, setMassConsensusProcess } from '@/redux/massConsensus/massConsensusSlice'
import { getMassConsensusProcess } from '@/controllers/db/massConsensus/getMassConsensus'
import { LoginType } from 'delib-npm'

const MassConsensus = () => {
	const { dir } = useUserConfig();
	const dispatch = useDispatch();
	const { statementId } = useParams()
	const { user } = useAuthentication()
	const subscription = useSelector(statementSubscriptionSelector(statementId))
	const loginType = user?.isAnonymous ? LoginType.anonymous : LoginType.google;
	const steps = useSelector(massConsensusStepsSelector(statementId, loginType))

	console.log(steps)

	useEffect(() => {
		if (!subscription && user) {
			const subscriptionId = getStatementSubscriptionId(statementId, user.uid)
			getStatementSubscriptionFromDB(subscriptionId).then(subscription => {
				if (subscription) {
					dispatch(setStatementSubscription(subscription))
				}
			})
		}
	}, [subscription, user])

	useEffect(() => {

		if (user) {
			setMassConsensusMemberToDB(user, statementId);

			getMassConsensusProcess(statementId).then((process) => {
				if (process) {
					dispatch(setMassConsensusProcess(process))
				}
			})
		}
	}, [user])

	return (
		<HeaderProvider>
			<HeaderMassConsensus />
			<div className={styles.massConsensus} style={{ direction: dir }}>
				<div className={styles.massConsensus__wrapper}>
					<Outlet />
				</div>
			</div>
		</HeaderProvider>
	)
}

export default MassConsensus
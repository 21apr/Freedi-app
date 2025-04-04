import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import MoreLeft from '../../../assets/icons/moreLeft.svg?react';
import MoreRight from '../../../assets/icons/moreRight.svg?react';
import Logo from '../../../assets/logo/106 x 89 SVG.svg?react';
import GoogleLoginButton from '../../components/buttons/GoogleLoginButton';
import EnterNameModal from '../../components/enterNameModal/EnterNameModal';
import styles from './Start.module.scss';
import StartPageImage from '@/assets/images/StartPageImage.png';
import { LANGUAGES } from '@/constants/Languages';
import { useAppSelector } from '@/controllers/hooks/reduxHooks';
import useDirection from '@/controllers/hooks/useDirection';
import { LanguagesEnum, useLanguage } from '@/controllers/hooks/useLanguages';
import {
	selectInitLocation,
} from '@/redux/location/locationSlice';
import { userSelector } from '@/redux/users/userSlice';
import packageJson from '../../../../package.json';

const Start = () => {
	const navigate = useNavigate();
	const user = useAppSelector(userSelector);
	const initLocation = useAppSelector(selectInitLocation);
	const [shouldShowNameModal, setShouldShowNameModal] = useState(false);
	const savedLang = localStorage.getItem('lang');
	const direction = useDirection();

	const { t, changeLanguage } = useLanguage();
	const defaultLang = 'he';
	const version = packageJson.version;

	useEffect(() => {
		if (!savedLang) {
			localStorage.setItem('lang', defaultLang);
		}
	}, []);

	useEffect(() => {
		if (user) {
			navigate(initLocation || '/home', {
				state: { from: window.location.pathname },
			});
		}
	}, [user]);

	return (
		<div className={styles.splashPage}>
			<div className={styles.mainLogo}>
				<div className={styles.freeDiIcon}>
					<Logo />
				</div>
				<div className={styles.mainLogo__title}>
					<span className={styles.mainLogo__Free}>Free</span>
					<span className={styles.mainLogo__Di}>Di</span>
				</div>
				<span className={styles.mainLogo__slogan}>
					{t('Fostering Collaborations')}
				</span>
			</div>
			<div className={styles.version}>v: {version}</div>
			<select
				className={styles.language}
				defaultValue={savedLang || defaultLang}
				onChange={(e) => {
					const lang = e.target.value as LanguagesEnum;
					changeLanguage(lang);
					if (lang === 'he' || lang === 'ar') {
						document.body.style.direction = 'rtl';
					} else {
						document.body.style.direction = 'ltr';
					}
					localStorage.setItem('lang', lang);
				}}
			>
				{LANGUAGES.map(({ code, label }) => (
					<option key={code} value={code}>
						{label}
					</option>
				))}
			</select>
			<button
				style={{ flexDirection: direction }}
				data-cy='anonymous-login'
				className={`${styles.anonymous} ${direction === 'row' ? styles.ltr : styles.rtl}`}
				onClick={() => setShouldShowNameModal((prev) => !prev)}
			>
				{direction === 'row-reverse' ? <MoreLeft /> : null}
				{t('Login with a temporary name')}{' '}
				{direction === 'row' ? <MoreRight /> : null}
			</button>

			<GoogleLoginButton />

			<img src={StartPageImage} alt='' className={styles.StratPageImage} />
			<a href='http://delib.org' target='_blank' className={styles.ddi}>
				<footer>{t('From the Institute for Deliberative Democracy')}</footer>
			</a>

			{shouldShowNameModal && (
				<EnterNameModal closeModal={() => setShouldShowNameModal(false)} />
			)}
		</div>
	);
};

export default Start;

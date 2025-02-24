import React, { FC, useEffect } from 'react';
import { handleGetVoters } from '../statementSettingsCont';
import MembersChipsList from './membership/membersChipsList/MembersChipList';
import { useUserConfig } from '@/controllers/hooks/useUserConfig';
import { Vote } from '@/types/vote';
import { Creator } from '@/types/user/User';

interface GetVotersProps {
	statementId: string;
	joinedMembers: Creator[];
}

const GetVoters: FC<GetVotersProps> = ({ statementId, joinedMembers }) => {
	const { t } = useUserConfig();

	const [voters, setVoters] = React.useState<Vote[]>([]);
	const [nonVoters, setNonVoters] = React.useState<Creator[]>([]);
	const [clickedVoters, setClickedVoters] = React.useState(false);
	const [clickedNonVoters, setClickedNonVoters] = React.useState(false);

	const getVoters = () => {
		if (!clickedVoters) {
			handleGetVoters(statementId, setVoters, setClickedVoters);
		} else {
			setClickedVoters(false);
		}
	};

	useEffect(() => {
		if (voters.length === 0) {
			setNonVoters(joinedMembers);
		} else {
			const voterIds = new Set(voters.map((voter) => voter.voter?.uid));
			const nonVotersList = joinedMembers.filter(
				(member) => !voterIds.has(member.uid)
			);
			setNonVoters(nonVotersList);
		}
	}, [voters, joinedMembers]);

	return (
		<>
			<button
				type='button'
				className='voters-button form-button'
				onClick={getVoters}
				tabIndex={0}
			>
				{t('Get Voters')}
			</button>

			{clickedVoters && (
				<>
					{voters.length > 0 ? (
						<>
							<span>
								{voters.length} {t('Voted')}
							</span>
							<MembersChipsList
								members={voters.map((v) => v.voter as Creator)}
							/>
						</>
					) : (
						<div>{t('No voters found')}</div>
					)}
				</>
			)}

			<button
				type='button'
				className='voters-button form-button'
				onClick={() => setClickedNonVoters(!clickedNonVoters)}
				tabIndex={0}
			>
				{t('Get Non Voters')}
			</button>

			{clickedNonVoters && (
				<>
					{nonVoters.length > 0 ? (
						<>
							<span>
								{nonVoters.length} {t('Did Not Vote')}
							</span>
							<MembersChipsList members={nonVoters} />
						</>
					) : (
						<div>{t('No non-voters found')}</div>
					)}
				</>
			)}
		</>
	);
};

export default GetVoters;

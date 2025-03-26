import { Collections, Creator, getStatementSubscriptionId, LoginType, MassConsensusMember, MassConsensusPageUrls, MassConsensusProcessSchema, User } from "delib-npm";
import { DB } from "../config";
import { doc, setDoc } from "firebase/firestore";
import { convertFirebaseUserToCreator } from "@/types/user/userUtils";
import { parse, partial } from "valibot";

export async function setMassConsensusMemberToDB(creator: Creator | User, statementId: string) {
	try {
		const newMember: MassConsensusMember = {
			statementId,
			lastUpdate: new Date().getTime(),
			creator: convertFirebaseUserToCreator(creator)
		};
		const memberId = getStatementSubscriptionId(statementId, creator);
		if (!memberId) throw new Error('Error getting member id');
		const memberRef = doc(DB, Collections.massConsensusMembers, memberId);
		await setDoc(memberRef, newMember, { merge: true });

		return { message: 'Member added successfully', ok: true };
	} catch (error) {
		console.error(error);

		return { message: 'Error adding member', ok: false };
	}
}

interface MassConsensusProcessProps {
	processList: MassConsensusPageUrls[];
	loginType?: LoginType;
	statementId: string;
	processName?: string;
}

export async function reorderMassConsensusProcessToDB({ processList, loginType, statementId, processName }: MassConsensusProcessProps) {
	try {
		const processRef = doc(DB, Collections.massConsensusProcesses, statementId);

		// Prepare the update data based on loginType
		let updateData = {
			statementId,
			loginTypes: {}
		}; // Use 'any' type to handle dynamic key assignment

		const type = loginType ?? "default";

		updateData.loginTypes[type] = {
			steps: processList
		};

		if (processName) {
			updateData[type].processList = processName;
		}

		const PartialMassConsensusProcessSchema = partial(MassConsensusProcessSchema);
		parse(PartialMassConsensusProcessSchema, updateData);

		// Update the document in Firestore
		await setDoc(processRef, updateData, { merge: true });

	} catch (error) {
		console.error(error);

	}
}
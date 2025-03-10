import {
	object,
	string,
	number,
	boolean,
	optional,
	nullable,
	enum_,
	InferOutput,
} from 'valibot';
import { Access, membersAllowed, StepType } from '../TypeEnums';

export const CreatorSchema = object({
	displayName: string(),
	photoURL: optional(nullable(string())),
	uid: string(),
});

export type Creator = InferOutput<typeof CreatorSchema>;

export const MembershipSchema = object({
	adminApproveMembers: optional(boolean()),
	access: optional(enum_(Access)),
	typeOfMembersAllowed: optional(enum_(membersAllowed)),
});

export type Membership = InferOutput<typeof MembershipSchema>;

export const StepSchema = object({
	stepId: string(),
	stepType: enum_(StepType),
	instructions: optional(string()),
	duration: optional(number()),
	endTime: optional(number()),
	order: optional(number()),
});

export type Step = InferOutput<typeof StepSchema>;

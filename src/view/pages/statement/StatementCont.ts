import { Statement, NavObject, Screen, StatementSubscription, User,Role} from "delib-npm";
import { showNavElements } from "./components/nav/top/statementTopNavCont";
import { allScreens } from "./components/nav/top/StatementTopNavModel.tsx";
import { createContext } from "react";

export function availableScreen(
	statement: Statement | undefined,
	statementSubscription: StatementSubscription | undefined,
	screenLink: Screen | undefined,
): Screen | undefined {
	try {
		if (!statement) return screenLink;
		if (!screenLink) throw new Error("urlSubPage is undefined");
		if (statement.subScreens === undefined)
			throw new Error("statement.subScreens is undefined");
		if (statement.subScreens.length === 0)
			throw new Error("statement.subScreens is empty");

		const subScreens: NavObject[] = showNavElements({ statement, statementSubscription, navArray: allScreens });

		const subScreensLinks: Screen[] = subScreens.map(
			(navObj: NavObject) => navObj.link,
		);
		if (!subScreensLinks) throw new Error("subScreensLinks is undefined");

		let returnedLink: Screen = Screen.CHAT;
		if (subScreensLinks.includes(screenLink)) {
			returnedLink = screenLink;
		} else {
			returnedLink = subScreensLinks[0];
		}

		return returnedLink;
	} catch (error) {
		console.error(error);

		return screenLink;
	}
}

interface StatementContextProps {
	statement: Statement | undefined;
	talker: User | null;
	handleShowTalker: (talker: User | null) => void;
	role:Role | undefined;
}

export const StatementContext = createContext<StatementContextProps>(
	{
		statement: undefined,
		talker: null,
		role: undefined,
		handleShowTalker: () => {
			return;
		},
	},
);
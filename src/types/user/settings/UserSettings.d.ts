export interface UserSettings {
	userId: string;
	fontSize?: number;
	color?: string;
	defaultLanguage?: string;
	agreement?: Agreement | null;
	role?: Role;
	learning?: {
		evaluation?: number;
		addOptions?: number;
	};
}

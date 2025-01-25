export enum CutoffType {
	topOptions = 'topOptions',
	cutoffValue = 'cutoffValue',
}

export enum ChoseByEvaluationType {
	consensus = 'consensus',
	likes = 'likes',
	likesDislikes = 'likesDislikes',
}

export interface ChoseBy {
	statementId: string;
	cutoffType: CutoffType;
	choseByEvaluationType: ChoseByEvaluationType;
	number: number;
}

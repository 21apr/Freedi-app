export enum ResultsBy {
	consensusLevel = 'consensus-level',
	topOptions = 'topOptions',
	checkedBy = 'checkedBy',
	privateCheck = 'privateCheck',
}

export interface Results {
	top: Statement;
	sub: Results[];
}

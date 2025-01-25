export enum SignatureType {
	signed = 'signed',
	rejected = 'rejected',
	viewed = 'viewed',
}

export interface DocumentSigns {
	documentId: string;
	viewed: number;
	signed: number;
	rejected: number;
	avgSignatures: number;
	totalSignaturesLevel: number;
}

export interface Signature {
	signatureId: string;
	documentId: string;
	userId: string;
	signed: SignatureType;
	date: string;
	levelOfSignature: number;
}

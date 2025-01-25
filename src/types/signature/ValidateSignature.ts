import { DocumentSigns, Signature, SignatureType } from './Signature';

export function validateSignature(sig: unknown): sig is Signature {
	if (!sig || typeof sig !== 'object') return false;
	const s = sig as Signature;

	return (
		typeof s.signatureId === 'string' &&
		typeof s.documentId === 'string' &&
		typeof s.userId === 'string' &&
		Object.values(SignatureType).includes(s.signed) &&
		typeof s.date === 'string' &&
		typeof s.levelOfSignature === 'number'
	);
}

export function validateDocumentSigns(signs: unknown): signs is DocumentSigns {
	if (!signs || typeof signs !== 'object') return false;
	const s = signs as DocumentSigns;

	return (
		typeof s.documentId === 'string' &&
		typeof s.viewed === 'number' &&
		typeof s.signed === 'number' &&
		typeof s.rejected === 'number' &&
		typeof s.avgSignatures === 'number' &&
		typeof s.totalSignaturesLevel === 'number'
	);
}

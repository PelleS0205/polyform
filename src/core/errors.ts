export class PolyformError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PolyformError";
	}
}

export class PolyformParseError extends PolyformError {
	constructor(format: string, originalError: Error) {
		super(
			`Failed to parse ${format.toUpperCase()}: ${originalError.message}`,
		);
		this.name = "PolyformParseError";
		this.stack = originalError.stack;
	}
}

export class PolyformSerializeError extends PolyformError {
	constructor(format: string, originalError: Error) {
		super(
			`Failed to serialize to ${format.toUpperCase()}: ${originalError.message}`,
		);
		this.name = "PolyformSerializeError";
		this.stack = originalError.stack;
	}
}

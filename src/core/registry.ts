export type ParserFn = (input: string, options?: any) => any;
export type SerializerFn = (ast: any, options?: any) => string;

export const parsers = new Map<string, ParserFn>();
export const serializers = new Map<string, SerializerFn>();

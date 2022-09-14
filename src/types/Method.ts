export type Methods = Record<string, Method>

export interface Method {
    "argument": string;
    "return": string;
    "entry-point": string;
    "description": string;
    "read-only": boolean;
}

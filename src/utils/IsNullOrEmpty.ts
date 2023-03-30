export function IsEmpty(data: object): boolean {
    return Object.keys(data).length === 0;
}

export function IsNullOrEmpty(data: object): boolean {
    return Object.keys(data).length === 0 || data === null;
}

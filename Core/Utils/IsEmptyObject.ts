export function IsEmpty(data: object): boolean {
    return Object.keys(data).length === 0
}

export function IsEmptyOrNull(data: object): boolean {
    return Object.keys(data).length === 0 || data === null
}
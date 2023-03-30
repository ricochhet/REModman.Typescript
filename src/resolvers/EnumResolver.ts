export default class EnumResolver {
    public static From(
        enums: { [key: string]: any },
        value: any,
    ): string | undefined {
        for (const item in enums) {
            if (enums[item] === value) {
                return item;
            }
        }
    }
}

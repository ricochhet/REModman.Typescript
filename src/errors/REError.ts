export default class REError extends Error {
    public Name: string;
    public Message: string;
    public Stack?: string | undefined;
    public Solution: string;
    public ErrorReferenceString: string | undefined;

    public constructor(
        name: string,
        message: string,
        solution: string | null = null,
    ) {
        super(message);
        this.Name = name;
        this.Message = message;
        this.Solution = solution || '';
        Object.setPrototypeOf(this, REError.prototype);
    }

    public static fromThrownValue(
        error: REError | Error | unknown,
        defaultName: string = 'An unhandled error has occurred',
    ): REError {
        if (error instanceof REError) {
            return error;
        } else if (error instanceof Error) {
            return new REError(defaultName, error.message);
        } else {
            return new REError(defaultName, `${error}`);
        }
    }
}

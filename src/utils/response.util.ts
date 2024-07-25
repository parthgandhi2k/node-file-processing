export const getSuccessResponse = (
    message: string = '',
    data: object | null = null,
    statusCode: number = 200
) => ({
    status: "success",
    message,
    data,
    statusCode
});

export const getFailureResponse = (message: string = '', statusCode: number = 500) => ({
    status: "error",
    message,
    statusCode
});

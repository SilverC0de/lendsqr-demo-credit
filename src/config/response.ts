export class ServerResponse {
    static success = (data: any, message: string = "") => {
        return {
            status: "success",
            message: message,
            data: data
        };
    };

    static validationError = (data: any, message: string = "") => {
        return {
            status: "failed",
            message: message,
            data: data
        };
    };

    static clientError = (data: any, message: string = "") => {
        return {
            status: "failed",
            message: message,
            data: data
        };
    };

    static processingError = (data: any, message: string = "") => {
        return {
            status: "failed",
            message: message,
            data: data
        };
    };

    static thirdPartyError = (data: any, message: string = "") => {
        return {
            status: "failed",
            message: message,
            data: data
        };
    };

    static serverError = (data: any, message: string = "") => {
        return {
            status: "failed",
            message: message,
            data: data
        };
    };
}

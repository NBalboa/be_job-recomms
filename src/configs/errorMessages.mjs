function errorMessagesObject(errors) {
    const transformErrors = {};
    if (errors.length <= 0) {
        return "Invalid";
    }
    for (const error of errors) {
        const fieldName = error.path[0];
        let errorMessage = "";
        switch (error.type) {
            case "string.empty":
                const cleanMessage =
                    fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                errorMessage = `${cleanMessage.replace("_", " ")} is required`;
                break;
            case "string.email":
                errorMessage = "Email must be valid";
                break;
            case "any.only":
                errorMessage = "Password must be a match";
                break;
            default:
                errorMessage = "An error occurred";
        }

        transformErrors[fieldName] = errorMessage;
    }
    return transformErrors;
}

export { errorMessagesObject };

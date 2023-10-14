function yupErrorsMap(errors) {
    const errorMap = {};

    errors.inner.forEach((errors) => {
        errorMap[errors.path] = errors.message;
    });

    return errorMap;
}

export { yupErrorsMap };

exports.mapResponse = (message, data)  => {
    return { message: message, data: data ? data : {} };
}
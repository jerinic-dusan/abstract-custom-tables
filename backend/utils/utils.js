/**
 * Method maps response data to common response object
 */
exports.mapResponse = (code, message, data) => {
    return { code: code, message: message, data: data ? data : {} };
}

/**
 * Method checks whether the sort column is valid
 */
exports.sortColumnChecker = (sortColumn) => {
    const allowedColumn = ['name', 'type', 'price', 'createdAt'];
    return allowedColumn.some(item => item === sortColumn);
}

/**
 * Method checks whether the sort direction is valid
 */
exports.sortDirectionChecker = (sortDirection) => {
    sortDirection = Number(sortDirection);
    if (isNaN(sortDirection)) {
        return false;
    }
    return sortDirection === 1 || sortDirection === -1;
}
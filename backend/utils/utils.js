exports.mapResponse = (code, message, data) => {
    return { code: code, message: message, data: data ? data : {} };
}

exports.sortColumnChecker = (sortColumn) => {
    const allowedColumn = ['name', 'type', 'price', 'createdAt'];
    return allowedColumn.some(item => item === sortColumn);
}

exports.sortDirectionChecker = (sortDirection) => {
    sortDirection = Number(sortDirection);
    if (isNaN(sortDirection)) {
        return false;
    }
    return sortDirection === 1 || sortDirection === -1;
}
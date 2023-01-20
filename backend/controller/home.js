const database = require('../config/database');
const utils = require('../utils/utils');

exports.home = async (req, res) => {
    const response = utils.mapResponse(200, "Welcome home 🙌");
    res.status(200).json(response);
}

exports.fetchAllItems = async (req, res) => {
    try {
        const items = await database.fetchAllItems();
        const response = utils.mapResponse(200, "Successfully fetched all items", items);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500,`Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.fetchAllPagedItems = async (req, res) => {
    try {
        let {page, size, sortColumn, sortDirection, filter} = req.query;

        if (!(page && size)){
            const response = utils.mapResponse(400,"Bad input");
            return res.status(400).json(response);
        }

        if (page < 1) {
            const response = utils.mapResponse(400,`Page number must start with 1`);
            return res.status(400).json(response);
        }

        if (!(sortColumn && utils.sortColumnChecker(sortColumn))){
            const response = utils.mapResponse(`Sort column value can either be name, type, price or createdAt`);
            return res.status(400).json(response);
        }

        if (!(sortDirection && utils.sortDirectionChecker(sortDirection))){
            const response = utils.mapResponse(`Sort direction must be -1 or 1`);
            return res.status(400).json(response);
        }

        const skip = size * (page - 1);
        const limit = size;
        sortColumn = sortColumn ? sortColumn : 'name';
        sortDirection = sortDirection ? sortDirection : 1;
        filter = filter ? filter : '';

        const items = await database.fetchAllPagedItems(skip, limit, sortColumn, sortDirection, filter);
        const response = utils.mapResponse(200,"Successfully fetched all items", items);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500,`Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.addItem = async (req, res) => {
    try {
        const {name, type, price} = req.body;

        if (!(name && price)){
            const response = utils.mapResponse(400,"Bad input");
            return res.status(400).json(response);
        }

        const addedItem = await database.addItem({name: name, type: type, price: price, createdAt: Date.now()});
        const response = utils.mapResponse(200,`Successfully added new item by name ${addedItem.name}`, {_id: addedItem._id, name: addedItem.name, type: addedItem.type, price: addedItem.price, createdAt: addedItem.createdAt, details: []});
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500,`Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.editItem = async (req, res) => {
    try {
        const {id, name, type, price} = req.body;

        if (!(id && name && price)){
            const response = utils.mapResponse(400,"Bad input");
            return res.status(400).json(response);
        }

        const editedItem = await database.editItem(id, {name: name, type: type, price: price});
        const response = utils.mapResponse(200,`Successfully edited item by name ${editedItem.name}`, {_id: editedItem._id, name: editedItem.name, type: editedItem.type, price: editedItem.price, createdAt: editedItem.createdAt, details: editedItem.details});
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500,`Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}
//todo possibly return true if success
exports.deleteItem = async (req, res) => {
    try {
        const {id} = req.query;

        if (!(id)){
            const response = utils.mapResponse(400,"Bad input");
            return res.status(400).json(response);
        }

        const deletedItem = await database.deleteItem(id);
        const response = utils.mapResponse(200,`Successfully deleted item by name ${deletedItem.name}`);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500,`Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.getItemDetails = async (req, res) => {
    try {
        const {id} = req.query;

        if (!(id)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const itemWithDetails = await database.getItemWithDetails(id);
        const response = utils.mapResponse(200, "Successfully fetched item details", itemWithDetails.details);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.addItemDetail = async (req, res) => {
    try {
        const {id, name, value} = req.body;

        if (!(id && name)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const addedItem = await database.addItemDetail(id, {name: name, value: value});
        const response = utils.mapResponse(200, `Successfully added new item detail by name ${addedItem.name}`, addedItem.details);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.editItemDetail = async (req, res) => {
    try {
        const {itemId, detailId, name, value} = req.body;

        if (!(itemId && detailId && name)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const editedItem = await database.editItemDetail(itemId, detailId, {name: name, value: value});
        const response = utils.mapResponse(200, `Successfully edited item detail by name ${name}`, editedItem.details);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.deleteItemDetail = async (req, res) => {
    try {
        const {itemId, detailId} = req.query;

        if (!(itemId && detailId)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const editedItem = await database.deleteItemDetail(itemId, detailId);
        const response = utils.mapResponse(200, `Successfully deleted item detail`, {_id: editedItem._id, name: editedItem.name, type: editedItem.type, price: editedItem.price, createdAt: editedItem.createdAt, details: editedItem.details});
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.cartItems = async (req, res) => {
    try {
        const {userId} = req;

        const cartItems = await database.cartItems(userId);
        const response = utils.mapResponse(200, `Successfully fetched cart items`, cartItems.cart);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.addToCart = async (req, res) => {
    try {
        const {userId} = req;
        const {itemId} = req.body;

        if (!(itemId)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const result = await database.addToCart(userId, itemId);
        const response = utils.mapResponse(200, `Successfully added one item to cart`, result.cart);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const {userId} = req;
        const {itemId} = req.query;

        if (!(itemId)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const result = await database.removeFromCart(userId, itemId);
        const response = utils.mapResponse(200, `Successfully removed one item to cart`, result.cart);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}

exports.getCartItemDetails = async (req, res) => {
    try {
        const {itemId} = req.query;

        if (!(itemId)){
            const response = utils.mapResponse(400, "Bad input");
            return res.status(400).json(response);
        }

        const result = await database.getItemWithDetails(itemId);
        const response = utils.mapResponse(200, `Successfully cart item details`, result.details);
        res.status(200).json(response);
    } catch (error) {
        const response = utils.mapResponse(500, `Oops, something went wrong: ${error.message}`);
        return res.status(500).json(response);
    }
}
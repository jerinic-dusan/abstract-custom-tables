const { mongoose } = require("mongoose");
const { MONGO_URI } = process.env;
const Item = require('../model/item');
const Detail = require('../model/detail');
const User = require('../model/user');

/**
 * Method tries to connect to the database. If unsuccessful, server shuts down.
 */
const connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Successfully connected to the database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};

/**
 * Method fetches all available items from the database
 * @returns Promise<Array<Item>>
 */
const fetchAllItems = async () => {
    return Item.find().select('-details -__v');
}

/**
 * Method fetches filtered, sorted and paginated items
 * @param skip - Specifies the number of documents to skip
 * @param limit - Specifies max number of documents
 * @param sortColumn - Specifies the field by which sort will be executed
 * @param sortDirection - Specifies the direction of the sort
 * @param filter - Specifies the filtered word
 * @returns Array<Item>
 */
const fetchAllPagedItems = async (skip, limit, sortColumn, sortDirection, filter) => {
    const regex = new RegExp(filter, 'i')
    const filterObj = {
        $or: [
            {name: {$regex: regex}},
            {type: {$regex: regex}},
            {price: {$regex: regex}}
        ]
    };
    const result = await Promise.all([
        Item.count(filterObj),
        Item.find(filterObj)
            .sort([[sortColumn, sortDirection], ['_id', 1]])
            .skip(skip)
            .limit(limit)
            .select('-details -__v')
    ]);
    return {items: result[1], count: result[0]};
}

/**
 * Method creates a new item and return it
 * @param item - Specifies item to be added
 * @returns Promise<Item>
 */
const addItem = async (item) => {
    return Item.create(item);
}

/**
 * Method edits an existing item and returns it
 * @param itemId - Specifies item id
 * @param item - Specifies edited item
 * @returns Promise<Item>
 */
const editItem = async (itemId, item) => {
    return Item.findByIdAndUpdate(itemId, item, { new: true });
}

/**
 * Method deletes existing item and returns it
 * @param itemId - Specifies item id of item which is to be deleted
 * @returns Promise<Item>
 */
const deleteItem = async (itemId) => {
    const deletedItem = await Item.findByIdAndDelete(itemId);
    deletedItem.details.map(async (detail) => await Detail.deleteOne(detail));
    return deletedItem;
}

/**
 * Method fetches item details and returns item with its details
 * @param itemId - Specifies item id
 * @returns Promise<Item>
 */
const getItemWithDetails = async (itemId) => {
    return Item.findById(itemId).populate('details', '-__v').select('-__v');
}

/**
 * Method adds new item detail and returns edited item with its details
 * @param itemId - Specifies item id
 * @param detail - Specifies detail to be added
 * @returns Promise<Item>
 */
const addItemDetail = async (itemId, detail) => {
    const addedDetail = await Detail.create(detail);
    return Item.findByIdAndUpdate(
        itemId,
        {
            $push: { details: addedDetail._id }
        },
        { new: true, useFindAndModify: false }
    ).populate('details', '-__v');
}

/**
 * Method edits existing item detail and returns edited item with its details
 * @param itemId - Specifies item id
 * @param detailId - Specifies detail id
 * @param detail - Specifies detail to be edited
 * @returns Promise<Item>
 */
const editItemDetail = async (itemId, detailId, detail) => {
    await Detail.findByIdAndUpdate(detailId, detail);
    return Item.findById(itemId).populate('details', '-__v').select('-__v');
}

/**
 * Method deletes existing item detail and returns edited item with its details
 * @param itemId - Specifies item id
 * @param detailId - Specifies detail id
 * @returns Promise<Item>
 */
const deleteItemDetail = async (itemId, detailId) => {
    const deletedDetail = await Detail.findByIdAndDelete(detailId);
    return Item.findByIdAndUpdate(
        itemId,
        {
            pull: { details: deletedDetail._id }
        },
        { new: true, useFindAndModify: false }
    ).populate('details', '-__v');
}

/**
 * Method fetches user cart item
 * @param userId - Specifies user id
 * @returns Promise<Array<Item>>
 */
const cartItems = async (userId) => {
    return User.findById(userId).populate('cart', '-__v -details').select('-__v -_id -username -email -password');
}

/**
 * Method adds new item to the cart and returns the user
 * @param userId - Specifies user id
 * @param itemId - Specifies item id
 * @returns Promise<User>
 */
const addToCart = async (userId, itemId) => {
    return User.findByIdAndUpdate(userId,
        {
            $push: { cart: itemId }
        },
        { new: true, useFindAndModify: false }
    ).populate('cart', '-__v -details').select('-__v -_id -username -email -password');
}

/**
 * Method removes item from the cart and returns the user
 * @param userId - Specifies user id
 * @param itemId - Specifies item id
 * @returns Promise<User>
 */
const removeFromCart = async (userId, itemId) => {
    return User.findByIdAndUpdate(userId,
        {
            $pull: { cart: itemId }
        },
        { new: true, useFindAndModify: false }
    ).populate('cart', '-__v -_id -details').select('-__v -_id -username -email -password');
}

const db = {};

db.connect = connect;
db.fetchAllItems = fetchAllItems;
db.fetchAllPagedItems = fetchAllPagedItems;
db.addItem = addItem;
db.editItem = editItem;
db.deleteItem = deleteItem;
db.getItemWithDetails = getItemWithDetails;
db.addItemDetail = addItemDetail;
db.editItemDetail = editItemDetail;
db.deleteItemDetail = deleteItemDetail;
db.cartItems = cartItems;
db.addToCart = addToCart;
db.removeFromCart = removeFromCart;

module.exports = db;


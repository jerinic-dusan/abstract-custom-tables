const { mongoose } = require("mongoose");
const { MONGO_URI } = process.env;
const Item = require('../model/item');
const Detail = require('../model/detail');
const User = require('../model/user');

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

const fetchAllItems = async () => {
    return Item.find().select('-details -__v');
}

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

const addItem = async (item) => {
    return Item.create(item);
}

const editItem = async (itemId, item) => {
    return Item.findByIdAndUpdate(itemId, item, { new: true });
}

const deleteItem = async (itemId) => {
    const deletedItem = await Item.findByIdAndDelete(itemId);
    deletedItem.details.map(async (detail) => await Detail.deleteOne(detail));
    return deletedItem;
}

const getItemWithDetails = async (itemId) => {
    return Item.findById(itemId).populate('details', '-__v').select('-__v');
}

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

const editItemDetail = async (itemId, detailId, detail) => {
    await Detail.findByIdAndUpdate(detailId, detail);
    return Item.findById(itemId).populate('details', '-__v').select('-__v');
}

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

const cartItems = async (userId) => {
    return User.findById(userId).populate('cart', '-__v -details').select('-__v -_id -username -email -password');
}

const addToCart = async (userId, itemId) => {
    return User.findByIdAndUpdate(userId,
        {
            $push: { cart: itemId }
        },
        { new: true, useFindAndModify: false }
    ).populate('cart', '-__v -details').select('-__v -_id -username -email -password');
}

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


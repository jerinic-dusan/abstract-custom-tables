const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const homeController = require('../controller/home');

router.get('/', auth, homeController.home);
router.get('/items', auth, homeController.fetchAllItems);
router.post('/add-item', auth, homeController.addItem);
router.put('/edit-item', auth, homeController.editItem);
router.delete('/delete-item', auth, homeController.deleteItem);
router.get('/item-details', auth, homeController.getItemDetails);
router.post('/add-item-detail', auth, homeController.addItemDetail);
router.put('/edit-item-detail', auth, homeController.editItemDetail);
router.delete('/delete-item-detail', auth, homeController.deleteItemDetail);
router.get('/cart-items', auth, homeController.cartItems);
router.post('/add-to-cart', auth, homeController.addToCart);
router.delete('/remove-from-cart', auth, homeController.removeFromCart);
router.get('/cart-item-details', auth, homeController.getCartItemDetails);

module.exports = router;
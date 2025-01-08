const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemControllers');

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getDataItemsById);
router.post('/', itemController.createItems);
router.put('/:id', itemController.updateItems);
router.delete('/:id', itemController.deleteItems);

module.exports = router;
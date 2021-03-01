const {Router} = require('express');
const { find } = require('../controllers/search.controller');

const router = Router();

router.get('/:collection/:criteria', find)

module.exports = router;
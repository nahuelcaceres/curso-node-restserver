
const { Router } = require('express');
const router = Router();

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/user.controller') ;


router.get('/', usersGet );

router.put('/:id', usersPut );

router.post('/', usersPost );

router.delete('/', usersDelete );

router.patch('/', usersPatch ); 

module.exports = router;
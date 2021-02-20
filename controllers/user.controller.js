

const usersGet = (req, res) => {
    
    const {q, name = '', apikey} = req.query;

    res.status(200).json({
        message: 'get API - controller',
        q,
        name,
        apikey
    })

}

const usersPut = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        message: 'put API - controller',
        id
    })

}

const usersPost = (req, res) => {

    const {name, id} = req.body;

    res.status(200).json({
        message: 'post API - controller',
        name,
        id
    })

};

const usersDelete = (req, res) => {
    res.status(200).json({
        message: 'delete API - controller',
    })
};

const usersPatch = (req, res) => {
    res.status(200).json({
        message: 'patch API - controller',
    })
};

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
};
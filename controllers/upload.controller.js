const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');

const upload = async (req, res) => {

    try {
        const fullPath = await uploadFile(req.files, undefined, 'imgs');

        res.json({
            name: fullPath,
        });

    } catch (err) {
        res.status(400).json({ err });
    }

};

const updateImage = async (req, res) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe usuario con el id ${id}`, });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe producto con el id ${id}`, });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto', });
            break;
    }

    if (model.img) {
        const imgPath = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }
    }

    const nameFile = await uploadFile(req.files, undefined, collection);
    model.img = nameFile;

    await model.save();

    res.json(model);
}

const updateCloudinaryImage = async (req, res) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe usuario con el id ${id}`, });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe producto con el id ${id}`, });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto', });
            break;
    }

    if (model.img) {
        const arrName = model.img.split('/');
        const name = arrName[ arrName.length -1];

        const [ public_id ] = name.split('.');

        cloudinary.uploader.destroy ( public_id );
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;

    await model.save();

    res.json( model );
}


const showImage = async (req, res) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe usuario con el id ${id}`, });
            }
            break;

        case 'products':
            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({ msg: `No existe producto con el id ${id}`, });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto', });
    }

    if (model.img) {
        const imgPath = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(imgPath)) {
            return res.sendFile(imgPath);
        }
    }

    const imgPath = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(imgPath);
};


module.exports = {
    upload,
    updateImage,
    showImage,
    updateCloudinaryImage,
};
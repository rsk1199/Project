const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');  // Add this line

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Corrected the key to match your environment variable
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ['png', 'jpg', 'jpeg']  // Fixed the typo 'allowerdformats' to 'allowed_formats'
    },
});

const parser = multer({ storage: storage });

module.exports = parser;
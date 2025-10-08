import multer from "multer";
import path from "path";

// Configure multer for file storage
const multerFileUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({
    storage: multerFileUpload
});
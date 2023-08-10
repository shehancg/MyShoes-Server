import express from 'express';
import { ItemController } from '../controllers/itemController';
import multer from 'multer';

const FILE_TYPE_MAP: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError: Error | null = null;

        if (!isValid) {
            uploadError = new Error('invalid image type');
        }
        cb(uploadError, 'assets/uploads');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage });

const router = express.Router();
const itemController = new ItemController();

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/itemsadd', uploadOptions.single('image'), itemController.addItem);
router.delete('/:id', itemController.deleteItem);
router.get('/get/count', itemController.getItemCount);
router.patch('/:id', itemController.updateItem);

export default router;
export { uploadOptions };
``

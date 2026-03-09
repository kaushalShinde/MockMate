
import multer from 'multer';


const multerUpload = multer({
    limit: {
        fileSize: 1024 * 1024 * 10,
    },
});


// used so that it will upload the file only 5 mb
const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array('files', 5);


export { singleAvatar, attachmentsMulter };
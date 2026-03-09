

import { v4 as uuid} from 'uuid';

import { v2 as cloudinary} from 'cloudinary';
import { getBase64, getSockets } from '../lib/helper.js';



const emitEvent = (req, event, users, data) => {
    // console.log("emmitting event ", event);
    const io = req.app.get("io")

    const userSocket = getSockets(users);

    console.log(event, userSocket);
    io.to(userSocket).emit(event, data);

};

const uploadFilesToCloudinary = async (files=[]) => {

    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), {
                resource_type: "auto",
                public_id: uuid(),
            }, (error, result) => {
                if(error)    return reject(error);
                
                resolve(result);
            })
        })
    })

    try{
        const results = await Promise.all(uploadPromises);
        
        const formatedResult = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }))

        return formatedResult;
    }
    catch(error) {
        return new Error("Error Uploading files to Cloudinary", error);
    }
};


export { emitEvent, uploadFilesToCloudinary };  



import { userSocketIDs } from "../index.js";


export const getSockets = (users=[]) => {

    const sockets = users?.map((user) => userSocketIDs.get(user?.toString()))

    return sockets;
}


export const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}
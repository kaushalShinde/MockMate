
import { useMemo , useContext, createContext} from 'react';
import io from 'socket.io-client';
import { server } from './constants/config';


const SocketContext = createContext();

const useSocket = () => useContext(SocketContext);


const SocketProvider = ({ children }) => {

    const socket = useMemo(() => {
        return io(server, {withCredentials: true,})
    }, [])

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    )
}

export { useSocket, SocketProvider };


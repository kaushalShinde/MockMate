
// import { useEffect, useMemo , useContext, createContext} from 'react';
// import io from 'socket.io-client';
// import { server } from './constants/config';


// const SocketContext = createContext();

// const useSocket = () => useContext(SocketContext);


// const SocketProvider = ({ children }) => {

//     const socket = useMemo(() => {
//         return io(server, {withCredentials: true,})
//     }, []);

//     useEffect(() => {
//         return () => {
//           socket.disconnect();
//         };
//     }, [socket]);
      

//     return (
//         <SocketContext.Provider value={socket} >
//             {children}
//         </SocketContext.Provider>
//     )
// }

// export { useSocket, SocketProvider };


// GPT => 

import { useEffect, useMemo, useContext, createContext } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { server } from "./constants/config";
import { setMeetRequest, setMeetConfirmationDialogBox } from "./redux/reducers/meet";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ Establish socket connection once
  const socket = useMemo(() => {
    const s = io(server, { withCredentials: true });
    s.on("connect", () => console.log("✅ Global socket connected:", s.id));
    s.on("disconnect", () => console.log("❌ Global socket disconnected"));
    return s;
  }, [user]);

  useEffect(() => {
    // if (!socket || !user) return;

    // ✅ When someone requests a meet
    socket.on("ACCEPT_ZEGO_MEET", (data) => {
      console.log("📩 Meet request received globally:", data);
      if (data?.success) {
        const req = {
          sender: data?.data?.request?.sender,
          receiver: data?.data?.request?.receiver,
          roomId: data?.data?.request?.roomId,
        };
        dispatch(setMeetRequest(req));
        dispatch(setMeetConfirmationDialogBox(true));
      }
    });

    // ✅ When the meet is accepted/rejected
    socket.on("ZEGO_MEET_ACCEPTED", () => {
      console.log("✅ Meet accepted");
    });

    socket.on("ZEGO_MEET_REJECTED", () => {
      console.log("❌ Meet rejected");
    });

    // ✅ Cleanup on unmount
    return () => {
      socket.off("ACCEPT_ZEGO_MEET");
      socket.off("ZEGO_MEET_ACCEPTED");
      socket.off("ZEGO_MEET_REJECTED");
      socket.disconnect();
    };
  }, [socket, user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


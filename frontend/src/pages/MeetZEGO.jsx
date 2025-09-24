

import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMeetRequestAccepted, setMeetConfirmationDialogBox, setMeetRequest, setSendMeetRequestDialogBox } from '../redux/reducers/meet';
import { useNavigate } from 'react-router-dom';

const MeetZEGO = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { meetRequest } = useSelector((state) => state.meet);
    const roomId = meetRequest?.roomId;

    console.log(meetRequest);

    const zegoMeeting = async (element) => {
        const appID = 154091566; //process.env.REACT_APP_ZEGO_appID;
        const serverSecret = "3aa316246a9df27166aa51435e0f3570"; //process.env.REACT_APP_ZEGO_serverSecret;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, user?._id, user?.name);
        const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstance?.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            videoResolutionList: [
                ZegoUIKitPrebuilt.VideoResolution_360P,
                ZegoUIKitPrebuilt.VideoResolution_180P,
                ZegoUIKitPrebuilt.VideoResolution_480P,
                ZegoUIKitPrebuilt.VideoResolution_720P,
            ],
            videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P, 
            onLeaveRoom: () => {
                dispatch(setIsMeetRequestAccepted(false));
                dispatch(setSendMeetRequestDialogBox(false));
                dispatch(setMeetConfirmationDialogBox(false));
                dispatch(setMeetRequest(null));
                navigate('/chats');
            },

        })
    }


  return (
    <>
      <div 
        ref = {zegoMeeting} 
        style={{ width: "100%", height: "100vh", overflow: "hidden" }}
      />
    </>
  )
}

export default MeetZEGO;

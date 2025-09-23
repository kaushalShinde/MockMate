

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Avatar, Badge, Box, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { ChatRounded as ChatIcon, Home as HomeIcon, MenuRounded as MenuRoundedIcon, Notifications as NotificationIcon } from '@mui/icons-material'
import { orange } from '../../constants/colors.js';
import miscSlice, { setIsMobileScreen } from '../../redux/reducers/misc.js';
import CreatePostDialog from '../../dialogs/CreatePostDialog.jsx';
import { userNotExists } from '../../redux/reducers/auth.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../constants/config.js';
import NotificationItem from '../shared/NotificationItem.jsx';
import { useEffect } from 'react';
import NotificationList from '../specific/NotificationList.jsx';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { isMobileScreen } = useSelector((state) => state.misc);
    // const mobileScreen = useMediaQuery('(max-width: 599px)');
    // dispatch(setIsMobileScreen(mobileScreen));
    
    const { user, loader } = useSelector((state) => state.auth);

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotification, setAnchorElNotification] = useState(null);

    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [openCreatePost, setOpenCreatePost] = useState(false);

    const handleMobileCreatePost = () => {
        console.log('handleMobileCreatePost');
        setOpenCreatePost(true);
    }
    const handleMobileCreatePostClose = () => {
        setOpenCreatePost(false);
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        try{
            const response = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true });
            toast.success(response?.data?.message || "Success");
            dispatch(userNotExists());
        }
        catch(error) {
            toast.error(error?.message);
        }
    }
      
    const handleChatHomeClick = () => {
        // navigate('/chats')
        if (location.pathname === "/") {
          navigate("/chats");
        } else if (location.pathname === "/chats") {
          navigate("/");
        }
    }

    const handleNotificationAnchor = (event) => {
        setAnchorElNotification(event.currentTarget);
        setNotificationCount(notifications?.length)
    }
    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    }

    //todo
    const getAllNotifications = async () => {
        
    }

    useEffect(() => {
        getAllNotifications();
    }, [notifications]);

    return (
        <>
            <Box
                height={"4rem"}
                sx={{ 
                    flexGrow: 1,
                    marginTop: "-0.5rem",
                }}
            >
                <AppBar
                    position= 'static'
                    sx={{
                        // bgcolor: orange,
                        background: 'linear-gradient(160deg, #1E0342, #070F2B)',
                        border: '2px solid black',
                    }}
                >
                    
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "Quicksand, sans-serif",
                                fontWeight: "500",
                                letterSpacing: "10px",
                                color: "white",
                                marginLeft: "8rem",
                                cursor: "default",
                                display: {
                                    xs: "none",
                                    sm: 'block',
                                }
                            }}
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            MOCKMATE
                        </Typography>




                        {/* This is Middle Space of Navbar */}
                        <Box sx={{ flexGrow: 0.85}} />

                        
                        {/* Right Side of Navbar */}
                        <Stack 
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >

                            
                            {/* Create post dialog for mobile screen => so show button in header */}
                            {
                                isMobileScreen && (
                                    <Button  
                                        variant="text"
                                        sx={{
                                            color: "white",
                                            flexGrow: "1",
                                            // marginRight: "1rem",
                                        }}
                                        onClick={handleMobileCreatePost}
                                    > Post </Button>
                                )
                            }

                            <CreatePostDialog  
                                open={openCreatePost}
                                onClose={handleMobileCreatePostClose}
                            />

                            {
                                user && ( 
                                    <IconButton
                                        sx={{
                                            color: "white",
                                            flexGrow: "1",
                                            // marginRight: "1rem",
                                        }}
                                        onClick={handleChatHomeClick}
                                    >
                                        {location.pathname === "/" ? <ChatIcon /> : <HomeIcon />}
                                    </IconButton>
                                )
                            }
                            


                            {
                                user && (
                                    <>  
                                    {/* if want to show only notification icon  */}
                                    <IconButton
                                        size="large"
                                        sx={{
                                            color: "white",
                                            marginLeft: "1rem",
                                            marginRight: "2rem",
                                        }}
                                        onClick={handleNotificationAnchor}
                                    >
                                        <Badge badgeContent={notificationCount} color="primary">
                                            <NotificationIcon />
                                        </Badge>
                                    </IconButton>


                                    {/* Notification Menu */}
                                    <Menu
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        anchorEl={anchorElNotification}
                                        open={Boolean(anchorElNotification)}
                                        onClose={handleCloseNotificationMenu}
                                    >
                                        <Box
                                            sx={{
                                                maxHeight: "500px",
                                                overflowY: "auto",
                                                border: "1px solid #ccc",     
                                                backgroundColor: "#D9E0FF",                            
                                                scrollbarWidth: "none", // Firefox
                                                '&::-webkit-scrollbar': {
                                                    display: 'none',       // Chrome, Safari
                                                },
                                            }}
                                        >
                                            <NotificationList />
                                        </Box>
                                    </Menu>
                                    
                                </>)
                            }

                            
                            {/* For Profile */}
                            <Box sx={{ flexGrow: 1 }}>

                                {/* If user is looged in show profile option */}
                                {user && 
                                <>
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar 
                                            alt="Remy Sharp" 
                                            src={user?.avatar?.url}                                   
                                            sx={{
                                                // width: 48,
                                                // height: 48,
                                                // border: '2px solid #FFFFFF', // Gold border color
                                                // boxShadow: '0 0 7px #FFFFFF', // Glow effect using box-shadow
                                                // '&:hover': {
                                                //     boxShadow: '0 0 15px #FFD700', // Increase glow on hover
                                                // },
                                            }}
                                        />
                                    </IconButton>

                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center"> Profile </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <Typography textAlign="center"> Logout </Typography>
                                        </MenuItem>
                                    </Menu>
                                </>}


                                {/* If user noot logged in show signin register */}
                                {
                                    !user && 
                                        <>  
                                        <Stack 
                                            direction={"row"}
                                            alignItems={"center"}
                                            justifyContent={"center"}
                                        >
                                            <Typography
                                                color={"white"}
                                                variant="h6"
                                                fontFamily="sans-serif"
                                                sx={{
                                                    display: "block",
                                                    color: "black",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => {
                                                    navigate("/login");
                                                }}
                                            > Login  </Typography>
                                        </Stack>


                                        </>
                                }


                            </Box>

                        </Stack>
                        
                    </Toolbar>
                </AppBar>


            </Box>
        </>
    )
}

// const IconBtn = ({title, icon, onClick, value}) => {
//     return (
//         <Tooltip>
//             <IconButton
//                 color="inherit"
//                 size="large"
//                 onClick={onClick}
//             >
//                 value 
//                     ? ( <Badge badgeContent={value} color="error"> {icon} </Badge> ) 
//                     : ( icon )

//             </IconButton>
//         </Tooltip>
//     )
// }


export default Header;
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import axios from 'axios';
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);


  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bio, setBio] = useState("This is Bio");

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };


  const handleImageInputChange = (e) => {
    // const file = e.target.files[0];

    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     setAvatar(event.target.result);
    //   };
    //   reader.readAsDataURL(file);
    // }

    // if (file) {
    //   setAvatar(file);
    //   setAvatarPreview(URL.createObjectURL(file));
    // }

    const file = e.target.files[0];
    if (!file) {
      toast.error(`Please select the Profile Picture`);
      return;
    }
  
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WEBP images are allowed.');
      return;
    }
  
    if (file.size > maxSize) {
      toast.error('Image size should not exceed 5MB.');
      return;
    }
  
    const img = new Image();
    img.onload = () => {
  
      // All validations passed
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    };
  
    img.onerror = () => {
      toast.error('Invalid image file.');
    };
  
    img.src = URL.createObjectURL(file);

  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      }

      // axios request with config
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        username: username,
        password: password,
      }, config);

      console.log(data.user);
      dispatch(userExists(data.user));
      navigate('/chats');
      toast.success(data.message);
    }
    catch (error) {
      // Toast Here
      // console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    
    if (!avatar) {
      toast.error("Please upload a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('organization', organizationName);
    formData.append('bio', bio);
    formData.append('designation', designation);
    formData.append('avatar', avatar);

    // console.log(name, username, password, organizationName, designation)
    // console.log(formData.entries);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    try{
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type" : "multipart/form-data",
        },
      };
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, config);
      console.log(data);

      dispatch(userExists(data.user));
      navigate('/');
      toast.success(data.message);
    }
    catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };


  return (
    <>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "97vh",
          // width: "50rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5"> Login </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />

                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  margin="normal"
                  variant="outlined"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: "1rem",
                  }}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  {" "}
                  Or{" "}
                </Typography>

                <Button fullWidth varient="text" onClick={toggleLogin}>
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleRegister}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageInputChange}
                      style={{ display: "none" }}
                      id="avatar-input"
                    />
                    <label htmlFor="avatar-input">
                      <Avatar
                        sx={{
                          width: "8rem",
                          height: "8rem",
                          objectFit: "contain",
                          cursor: "pointer",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        src={avatarPreview}
                      />
                      {/* <CameraIcon /> */}
                    </label>
                  </div>
                </Stack>

                <TextField 
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {setName(e.target.value)}}
                />

                <TextField 
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username}
                  onChange={(e) => {setUsername(e.target.value)}}
                />

                <TextField 
                  required
                  fullWidth
                  type="passowrd"
                  label="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)}}
                />

                <TextField 
                  fullWidth
                  label="Organization's Name"
                  margin="normal"
                  value={organizationName}
                  onChange={(e) => {setOrganizationName(e.target.value)}}
                />

                <TextField 
                  fullWidth
                  label="Designation"  
                  margin="normal"
                  value={designation}
                  onChange={(e) => {setDesignation(e.target.value)}}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: "1rem",
                  }}
                >
                  Register
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  {" "}
                  Or{" "}
                </Typography>

                <Button fullWidth varient="text" onClick={toggleLogin}>
                  Sign In Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Login;

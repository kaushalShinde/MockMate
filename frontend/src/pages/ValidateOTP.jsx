import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";

function ValidateOTP(props) {
  const type = props?.type;
  // name username email password designation organizationName avatar avatarPreview bio
  const name = props?.name;
  const username = props?.username;
  const email = props?.email;
  const password = props?.password;
  const designation = props?.designation;
  const organizationName = props?.organizationName;
  const avatar = props?.avatar;
  const bio = props?.bio;

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [otp, setOTP] = useState("");

  const handleLogin = async () => {
    // e.preventDefault();

    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // axios request with config
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          email: email,
          password: password,
        },
        config
      );

      dispatch(userExists(data.user));
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      navigate("/login")
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleRegister = async () => {
    // e.preventDefault();

    if (!avatar) {
      toast.error("Please upload a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("organization", organizationName);
    formData.append("bio", bio);
    formData.append("designation", designation);
    formData.append("avatar", avatar);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      navigate("/login");
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  const validate = (e) => {
    e.preventDefault();

    if(type === 'login') {
        handleLogin();
    }
    else {
        handleRegister();
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 12,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <form onSubmit={validate}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              Enter Verification Code
            </Typography>

            <TextField
              label="6-Digit OTP"
              variant="outlined"
              fullWidth
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              value={otp}
              sx={{
                '& .MuiInputLabel-root': {
                    color: 'black', // default
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'gray', // default border
                    },
                    '&:hover fieldset': {
                        borderColor: 'blue', // border on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'black', // border when focused
                    },
                    '&.Mui-error fieldset': {
                        borderColor: 'red', // border when in error state
                    },
                },
              }}
              onChange={(e) => setOTP(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={otp?.length !== 6}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#222', // slightly lighter/darker black on hover
                },
                '&:disabled': {
                    backgroundColor: '#555', // grey-ish when disabled
                    color: '#ccc',
                },
              }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default ValidateOTP;

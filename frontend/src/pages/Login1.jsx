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
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import ValidateOTP from "./ValidateOTP";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpSent, setOtpSent] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

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

      console.log(data.user);
      dispatch(userExists(data.user));
      navigate("/chats");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleOTP = (e) => {

    // todo
    // send otp to user's email
    
    
    e.preventDefault();
    setOtpSent(true);
  };

  return (
    <>
      {otpSent ? (
        <>
            <ValidateOTP 
                type={"login"} 
                email={email} 
                password={password}
            />
        </>
      ) : (
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
            <>
              <Typography variant="h5"> Login </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleOTP}
              >
                <TextField
                  required
                  fullWidth
                  label="Email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

                <Button fullWidth varient="text" onClick={navigateToRegister}>
                  Sign Up Instead
                </Button>
              </form>
            </>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Login;

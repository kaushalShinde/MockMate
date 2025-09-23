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

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpSent, setOtpSent] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bio, setBio] = useState("Something about yourself...");

  const NavigateToLogin = () => {
    navigate("/login");
  };

  const handleOTP = (e) => {
    // todo
    // send otp to user's email

    if (!avatar) {
      e.preventDefault();
      toast.error("Please upload a profile picture.");
      return;
    }

    setOtpSent(true);
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error(`Please select the Profile Picture`);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should not exceed 5MB.");
      return;
    }

    const img = new Image();
    img.onload = () => {
      // All validations passed
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
    };

    img.src = URL.createObjectURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

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
      console.log(data);

      dispatch(userExists(data.user));
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      {otpSent ? (
        <>
            <ValidateOTP
                type={"register"}
                name={name}
                username={username}
                email={email}
                password={password}
                designation={designation}
                organizationName={organizationName}
                avatar={avatar}
                avatarPreview={avatarPreview}
                bio={bio}
            />
        </>
      ) : (
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
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleOTP}
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
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <TextField
                    required
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    inputProps={{
                        pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", // Regex for email validation
                    }}
                />

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
                  type="passowrd"
                  label="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <TextField
                  fullWidth
                  label="Organization's Name"
                  margin="normal"
                  value={organizationName}
                  onChange={(e) => {
                    setOrganizationName(e.target.value);
                  }}
                />

                <TextField
                  fullWidth
                  label="Designation"
                  margin="normal"
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
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
                  Register
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  {" "}
                  Or{" "}
                </Typography>

                <Button fullWidth varient="text" onClick={NavigateToLogin}>
                  Sign In Instead
                </Button>
              </form>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default Register;

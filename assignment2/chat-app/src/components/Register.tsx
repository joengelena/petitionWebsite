import {Link, useNavigate} from "react-router-dom";
import {useUserInfoStorage} from "../store";
import React from "react";
import axios from 'axios';
import {Button, TextField, Typography, Alert, AlertTitle, Paper} from '@mui/material';
import {Visibility, VisibilityOff} from "@mui/icons-material";
const baseUrl = "http://localhost:4941/api/v1";

const Register = () => {
    const navigate = useNavigate();
    const setUserInStorage = useUserInfoStorage(state => state.setUser);
    const [token, setToken] = React.useState('')
    const [userId, setUserId] = React.useState(-1)

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const register = () => {
        if (firstName.trim().length === 0) {
            setErrorFlag(true)
            setErrorMessage("First name cannot only include spaces")
            return;
        }
        if (lastName.trim().length === 0) {
            setErrorFlag(true)
            setErrorMessage("Last name cannot only include spaces")
            return;
        }
        if (email.trim().length === 0) {
            setErrorFlag(true)
            setErrorMessage("Email cannot only include spaces")
            return;
        }
        if (password.trim().length === 0) {
            setErrorFlag(true)
            setErrorMessage("Password cannot only include spaces")
            return;
        }
        if (firstName.trim().length === 0) {
            setErrorFlag(true)
            setErrorMessage("First name cannot only include spaces")
            return;
        }
        const config = {
            method: "post",
            url: baseUrl + "/users/register",
            headers: { "Content-Type": "application/json" },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            },
        };

        axios(config)
            .then((response) => {
                setUserId(response.data.userId)
                setErrorFlag(false)
                setErrorMessage("")
                login();
            },
            (error) => {
                setErrorFlag(true);
                if (error.response.statusText.includes("fewer than 1")) {
                    setErrorMessage("Please fill out the required fields")
                } else if (error.response.statusText === "Bad Request: data/firstName must NOT have more than 64 characters") {
                    setErrorMessage("First name too long! Keep it under 64 characters.")
                } else if (error.response.statusText === "Bad Request: data/lastName must NOT have more than 64 characters") {
                    setErrorMessage("Last name too long! Keep it under 64 characters.")
                } else if (error.response.statusText === "Bad Request: data/password must NOT have more than 64 characters") {
                    setErrorMessage("Password too long! Keep it under 64 characters.")
                } else if (error.response.statusText === "Bad Request: data/email must NOT have more than 256 characters") {
                    setErrorMessage("Email too long! Keep it under 256 characters.")
                } else if (error.response.statusText.includes("email")) {
                    setErrorMessage("Please enter a valid email address")
                } else if (error.response.statusText.includes("fewer than 6")) {
                    setErrorMessage("Password must be at least 6 characters")
                } else if (error.response.statusText === "Forbidden: Email already in use") {
                    setErrorMessage("Email is already in use. Please enter a different email")
                } else {
                    setErrorMessage(error.response.statusText)
                }
            }
        );
    };

    const login = () => {
        const config = {
            method: "post",
            url: baseUrl + "/users/login",
            headers: { "Content-Type": "application/json" },
            data: {
                email: email,
                password: password,
            },
        };

        axios(config)
            .then((response) => {
                setToken(response.data.token)
                setUserId(response.data.userId)
                setUserInStorage({userId: response.data.userId, token: response.data.token})
                setErrorMessage("")
                setErrorFlag(false)
                navigate(`/users/${response.data.userId}/uploadImage`);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    }

    return (
        <div style={{padding: 50}}>
            <Paper elevation={2} style={{padding: 20, margin: 'auto', maxWidth: 500}}>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>
                    Register
                </Typography>
                <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    required
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    required
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    placeholder="abc@email.com"
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                />
                <TextField
                    required
                    label="Password"
                    variant="outlined"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    placeholder="******"
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 8 }}
                    InputProps={{
                        endAdornment: (
                            <Button sx={{color: "#000000"}} onClick={() => setPasswordVisible(!passwordVisible)}>
                                {passwordVisible ? <VisibilityOff/> : <Visibility/>}
                            </Button>
                        )
                    }}
                />
                {errorFlag &&
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ background: "#0f574a",  marginBottom: 1, marginTop: 1,
                        "&:hover": {
                            background: "#1a937d",
                        }
                    }}
                    onClick={register}
                >
                    Register
                </Button>
                <Link style={{color: "#000000"}} to="/login" >
                    Already Registered?
                </Link>
            </Paper>
        </div>
    );
}

export default Register;
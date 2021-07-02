import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login, register } from "./store/utils/thunkCreators";
import { clearLoginState, switchLoginState } from "./store/login";
import banner from "./img/banner.png";
import bubble from "./img/bubble.svg";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
  },
  image: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85)), url(${banner})`,
    backgroundSize: "cover",
  },
  iconContainer: {
    display: "flex",
    flexDirection:"column",
    justifyContent: "center",
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  bubbleIcon: {
    display: "block",
    margin: "auto",
  },
  bannerText: {
    color: "white",
    fontSize: "x-large",
    whiteSpace: "pre",
    textAlign: "center",
    marginTop: 30,
  },
  submitButton: {
    display: "block",
    margin: "auto",
    marginTop: 20,
    backgroundColor: "#3A8DFF",
    color: "white",
    width: "100px",
  },
  pageSwitch: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  pageSwitchButton: {
    marginLeft: 10,
    backgroundColor: "white",
    color: "#3A8DFF",
  },
  formTitle: {
    fontSize: "x-large",
    fontWeight: "bold",
  }
}));


const Login = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const { user, login, register, loginState, switchLoginState, clearLoginState } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handlePageSwitch = () => {
    history.push(nextPath);
    switchLoginState();
  };

  const handleSubmit = (event) => {
    if (loginState === "login") {
      handleLogin(event);
    } else if (loginState === "register") {
      handleRegister(event);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
    
  };

  if (user.id) {
    clearLoginState();
    return <Redirect to="/home" />;
  }

  const submitButtonText = loginState === "login" ?
                            "Log in" :
                            "Create";

  const pageSwitchText = loginState === "login" ?
                          "Don't have an account?" :
                          "Already have an account?";

  const pageSwitchButtonText = loginState === "login" ?
                                "Create Account" :
                                "Log in";

  const formTitleText = loginState === "login" ? 
                          "Welcome Back!" :
                          "Create an account."
  
  const nextPath = loginState === "login" ? 
                    "/register" :
                    "/login"

  return (
      <Grid container className={classes.root}>
        <Grid container item xs={12} sm={5} className={classes.image}>
          <Grid container item justify="center" className={classes.iconContainer}>
            <Box>
              <img src={bubble} alt="text bubble icon" className={classes.bubbleIcon}/>
              <Typography className={classes.bannerText}>Converse with anyone<br />with any language</Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container item xs={12} sm={7}>
          <Grid container item className={classes.pageSwitch}>
            <Grid item>
              <Typography 
                style={{padding: 10, color: "grey"}}>
                  {pageSwitchText}
              </Typography>
            </Grid>
            <Grid item>
              <Button type="button" variant="contained" size="large" className={classes.pageSwitchButton}
                onClick={handlePageSwitch}>
                    {pageSwitchButtonText}
              </Button>
            </Grid>
          </Grid>
          <Grid container item alignItems="center" direction="column">
            <form onSubmit={handleSubmit}>
              <Grid item>
                <Typography className={classes.formTitle}>{formTitleText}</Typography>
              </Grid>
              <Grid item>
                <FormControl margin="normal" required>
                  <TextField
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                  />
                </FormControl>
              </Grid>
              {loginState === "login" && <Grid item>
                <FormControl margin="normal" required>
                  <TextField
                    label="Password"
                    aria-label="password"
                    type="password"
                    name="password"
                  />
                </FormControl>
              </Grid>}
              {loginState === "register" && <Grid item>
                <FormControl margin="normal" required>
                  <TextField
                    label="E-mail address"
                    aria-label="e-mail address"
                    type="email"
                    name="email"
                    required
                  />
                </FormControl>
              </Grid>}
              {loginState === "register" && <Grid item>
                <FormControl margin="normal" error={!!formErrorMessage.confirmPassword}>
                  <TextField
                    aria-label="password"
                    label="Password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="password"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>}
              {loginState === "register" && <Grid item>
                <FormControl margin="normal" error={!!formErrorMessage.confirmPassword}>
                  <TextField
                    label="Confirm Password"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    required
                  />
                  <FormHelperText>
                    {formErrorMessage.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Grid>}
              <Grid item>
                <Button type="submit" variant="contained" size="large" className={classes.submitButton}>
                      {submitButtonText}
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginState: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
    register: (credentials) => {
      dispatch(register(credentials));
    },
    clearLoginState: () => {
      dispatch(clearLoginState());
    },
    switchLoginState: () => {
      dispatch(switchLoginState());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
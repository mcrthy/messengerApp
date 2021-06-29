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
import { register } from "./store/utils/thunkCreators";
import banner from "./img/banner.png";
import bubble from "./img/bubble.svg";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
  },
  image: {
    backgroundImage: "linear-gradient(rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85)), url(" + banner + ")",
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
    position: "relative",
  },
  bubbleIcon: {
    display: "block",
    margin: "auto",
  },
  bannerText: {
    fontFamily: "'Open Sans', sans-serif",
    color: "white",
    fontSize: "x-large",
    whiteSpace: "pre",
    textAlign: "center",
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: "#3A8DFF",
    color: "white",
    fontFamily: "'Open Sans', sans-serif",
    width: "100px",
  },
  login: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  loginButton: {
    marginLeft: 10,
    backgroundColor: "white",
    color: "#3A8DFF",
  },
  createAccountText: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "x-large",
    fontWeight: "bold",
    paddingRight: 40,
  }
}));


const Login = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const bannerText = "Converse with anyone\nwith any language";

  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

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
    return <Redirect to="/home" />;
  }

  return (
      <Grid container className={classes.root}>
        <Grid container item xs={12} sm={5} className={classes.image}>
          <Grid container item justify="center" className={classes.iconContainer}>
            <Box>
              <img src={bubble} alt="text bubble icon" className={classes.bubbleIcon}/>
              <p className={classes.bannerText}>{bannerText}</p>
            </Box>
          </Grid>
        </Grid>


        <Grid container item xs={12} sm={7}>
          <Grid container item className={classes.login}>
            <Grid item>
              <Typography 
                style={{padding: 10, color: "grey", fontFamily: "'Open Sans', sans-serif",}}>
                  Already have an account?
              </Typography>
            </Grid>
            <Grid item>
              <Button type="button" variant="contained" size="large" className={classes.loginButton}
                onClick={() => history.push("/login")}>
                    Login
              </Button>
            </Grid>
          </Grid>
          <Grid container item alignItems="center" direction="column">
            <form onSubmit={handleRegister}>
              <Grid item>
                <Typography className={classes.createAccountText}>Create an account.</Typography>
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

              <Grid item>
                <FormControl margin="normal" required>
                  <TextField
                    label="E-mail address"
                    aria-label="e-mail address"
                    type="email"
                    name="email"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl error={!!formErrorMessage.confirmPassword}>
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
              </Grid>

              <Grid item>
                <FormControl error={!!formErrorMessage.confirmPassword}>
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
              </Grid>
  
              <Grid item>
                <Button type="submit" variant="contained" size="large" className={classes.registerButton}>
                      Create
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
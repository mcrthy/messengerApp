import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "./store/utils/thunkCreators";
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
  loginButton: {
    display: "block",
    margin: "auto",
    marginTop: 20,
    backgroundColor: "#3A8DFF",
    color: "white",
    fontFamily: "'Open Sans', sans-serif",
    width: "100px",
  },
  register: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  registerButton: {
    marginLeft: 10,
    backgroundColor: "white",
    color: "#3A8DFF",
  },
  welcomeText: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: "x-large",
    fontWeight: "bold",
  }
}));


const Login = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const bannerText = "Converse with anyone\nwith any language";

  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
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
          <Grid container item className={classes.register}>
            <Grid item>
              <Typography 
                style={{padding: 10, color: "grey", fontFamily: "'Open Sans', sans-serif",}}>
                  Don't have an account?
              </Typography>
            </Grid>
            <Grid item>
              <Button type="button" variant="contained" size="large" className={classes.registerButton}
                onClick={() => history.push("/register")}>
                    Create Account
              </Button>
            </Grid>
          </Grid>
          <Grid container item alignItems="center" direction="column">
            <form onSubmit={handleLogin}>
              <Grid item>
                <Typography className={classes.welcomeText}>Welcome back!</Typography>
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
                    label="Password"
                    aria-label="password"
                    type="password"
                    name="password"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" size="large" className={classes.loginButton}>
                      Login
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
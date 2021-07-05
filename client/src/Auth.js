import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { clearLoginState } from "./store/login";
import banner from "./img/banner.png";
import bubble from "./img/bubble.svg";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

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
}));

const useFormStyles = makeStyles(() => ({
  pageSwitch: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  pageSwitchText: {
    padding: 10,
    color: "grey",
  },
  pageSwitchButton: {
    marginLeft: 10,
    backgroundColor: "white",
    color: "#3A8DFF",
  },
  formTitle: {
    fontSize: "x-large",
    fontWeight: "bold",
  },
  submitButton: {
    display: "block",
    margin: "auto",
    marginTop: 20,
    backgroundColor: "#3A8DFF",
    color: "white",
    width: "100px",
  },
}));

const Auth = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const formClasses = useFormStyles();

  const user = useSelector(state => state.user);
  const loginState = useSelector(state => state.login);

  if (user.id) {
    dispatch(clearLoginState());
    return <Redirect to="/home" />;
  }

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

        {loginState === "login" && <Login classes={formClasses}/>}
        {loginState === "signup" && <Signup classes={formClasses}/>}

      </Grid>
  );
}

export default Auth;
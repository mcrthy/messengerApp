import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import banner from "./img/banner.png";
import bubble from "./img/bubble.svg";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

const useBannerStyles = makeStyles(() => ({
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

const useAuthStyles = makeStyles(() => ({
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
  const bannerClasses = useBannerStyles();
  const authClasses = useAuthStyles();

  const user = useSelector(state => state.user);

  const pathname = window.location.pathname;

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
      <Grid container className={bannerClasses.root}>
        <Grid container item xs={12} sm={5} className={bannerClasses.image}>
          <Grid container item justify="center" className={bannerClasses.iconContainer}>
            <Box>
              <img src={bubble} alt="text bubble icon" className={bannerClasses.bubbleIcon}/>
              <Typography className={bannerClasses.bannerText}>Converse with anyone<br />with any language</Typography>
            </Box>
          </Grid>
        </Grid>

        {(pathname === "/" || pathname === "/login") && <Login classes={authClasses}/>}
        {pathname === "/register" && <Signup classes={authClasses}/>}

      </Grid>
  );
}

export default Auth;
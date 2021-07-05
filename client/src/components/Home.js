import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles(() => ({
  root: {
    height: "97vh",
  },
}));

const useFetching = (fetch) => {
  useEffect( () => {
    fetch();
  }, []);
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Home = ({ user, logout, fetchConversations }) => {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const prevId = usePrevious(user.id);

  useFetching(fetchConversations);

  if (user.id !== prevId && isLoggedIn === false) {
    setLoggedIn(true);
  }

  const handleLogout = async () => {
    await logout(user.id);
  };

  if (!user.id) {
    if (isLoggedIn) {
      return <Redirect to="/login" />;
    }
    return <Redirect to="/register" />;
  }

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
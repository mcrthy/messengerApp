import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Grid,
  FormControl,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { login } from "../../store/utils/thunkCreators";

const Login = ({ classes }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handlePageSwitch = () => {
    history.push("/register");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    dispatch(login({ username, password }));
  };
  
  return (

    <Grid container item xs={12} sm={7}>

      <Grid container item className={classes.pageSwitch}>
        <Grid item>
          <Typography className={classes.pageSwitchText}>
              Don't have an account?
          </Typography>
        </Grid>
        <Grid item>
          <Button type="button" variant="contained" size="large" className={classes.pageSwitchButton}
            onClick={handlePageSwitch}>
                Create Account
          </Button>
        </Grid>
      </Grid>

      <Grid container item alignItems="center" direction="column">
        <form onSubmit={handleLogin}>
          <Grid item>
            <Typography className={classes.formTitle}>Welcome Back!</Typography>
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
            <Button type="submit" variant="contained" size="large" className={classes.submitButton}>
                Log In
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
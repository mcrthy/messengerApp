import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  FormControl,
  TextField,
  Button,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import { register } from "../../store/utils/thunkCreators";
import { switchLoginState } from "../../store/login";

const Signup = ({ classes, register, switchLoginState }) => {
  const history = useHistory();
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handlePageSwitch = () => {
    history.push("/login");
    switchLoginState();
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

  return (
    <Grid container item xs={12} sm={7}>

    <Grid container item className={classes.pageSwitch}>
      <Grid item>
        <Typography className={classes.pageSwitchText}>
            Already have an account?
        </Typography>
      </Grid>
      <Grid item>
        <Button type="button" variant="contained" size="large" className={classes.pageSwitchButton}
          onClick={handlePageSwitch}>
            Log In
        </Button>
      </Grid>
    </Grid>

    <Grid container item alignItems="center" direction="column">
      <form onSubmit={handleRegister}>
        <Grid item>
          <Typography className={classes.formTitle}>Create an account.</Typography>
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
        </Grid>
        <Grid item>
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
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained" size="large" className={classes.submitButton}>
            Create
          </Button>
        </Grid>
      </form>
    </Grid>
  </Grid>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
    switchLoginState: () => {
      dispatch(switchLoginState());
    },
  };
};


export default connect(null, mapDispatchToProps)(Signup);
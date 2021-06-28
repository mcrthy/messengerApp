import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "./store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

}));


const Login = (props) => {
  const history = useHistory();
  const classes = useStyles();

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
        <Grid item xs={12} sm={5}>
          <img src="https://www.rei.com/dam/van_dragt_031219_1_1363_how_to_snowboard_hero_lg.jpg" className={classes.image} alt="" />
        </Grid>
        <form onSubmit={handleLogin}>
          <Grid container item xs={12} sm={6} style={{padding: 10}}>
            <Grid>
              <FormControl margin="normal" required>
                <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Grid>
            <FormControl margin="normal" required>
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Grid>
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* <Grid container item xs={12} sm={6} style={{padding: 10}}>

        </Grid> */}
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

// import React from "react";
// import { Redirect, useHistory } from "react-router-dom";
// import { connect } from "react-redux";
// import {
//   Grid,
//   Box,
//   Typography,
//   Button,
//   FormControl,
//   TextField,
// } from "@material-ui/core";
// import { login } from "./store/utils/thunkCreators";

// const Login = (props) => {
//   const history = useHistory();
//   const { user, login } = props;

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     const username = event.target.username.value;
//     const password = event.target.password.value;

//     await login({ username, password });
//   };

//   if (user.id) {
//     return <Redirect to="/home" />;
//   }

//   return (
//     <Grid container justify="center">
//       <Box>
//         <Grid container item>
//           <Typography>Need to register?</Typography>
//           <Button onClick={() => history.push("/register")}>Register</Button>
//         </Grid>
//         <form onSubmit={handleLogin}>
//           <Grid>
//             <Grid>
//               <FormControl margin="normal" required>
//                 <TextField
//                   aria-label="username"
//                   label="Username"
//                   name="username"
//                   type="text"
//                 />
//               </FormControl>
//             </Grid>
//             <FormControl margin="normal" required>
//               <TextField
//                 label="password"
//                 aria-label="password"
//                 type="password"
//                 name="password"
//               />
//             </FormControl>
//             <Grid>
//               <Button type="submit" variant="contained" size="large">
//                 Login
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Box>
//     </Grid>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     user: state.user,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     login: (credentials) => {
//       dispatch(login(credentials));
//     },
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

// export default Login;


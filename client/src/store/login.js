const SWITCH_LOGIN_STATE = "SWITCH_LOGIN_STATE";
const CLEAR_LOGIN_STATE = "CLEAR_LOGIN_STATE";

export const switchLoginState = () => {
  return {
    type: SWITCH_LOGIN_STATE,
  };
};

export const clearLoginState = () => {
  return {
    type: CLEAR_LOGIN_STATE,
  };
}

const reducer = (state = "signup", action) => {
  switch (action.type) {
    case SWITCH_LOGIN_STATE: {
      if (state === "login") {
        return "signup";
      } else {
        return "login";
      }
    }
    case CLEAR_LOGIN_STATE: {
      return "";
    }
    default:
      return state;
  }
};

export default reducer;

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

const reducer = (state = { page: "register" }, action) => {
  switch (action.type) {
    case SWITCH_LOGIN_STATE: {
      if (state.page === "login") {
        return { page: "register" }
      } else {
        return { page: "login"}
      }
    }
    case CLEAR_LOGIN_STATE: {
      return { page: "" };
    }
    default:
      return state;
  }
};

export default reducer;

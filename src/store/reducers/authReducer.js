const initialState = {
    authToken: "",
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SAVE_AUTH_TOKEN":
        return {
          ...state,
          authToken: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  
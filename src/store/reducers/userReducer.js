const initialState = {
    userId: "",
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SAVE_USER_ID":
        return {
          ...state,
          userId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  
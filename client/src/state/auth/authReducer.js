import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  RECOVER_ERROR,
  RECOVER_SUCCESS,
  RECOVER_REQUEST,
  LOGOUT_SUCCESS,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_ERROR,
  CLEAR_MSGS,
  SEND_VERIFICATION_EMAIL_REQUEST,
  SEND_VERIFICATION_EMAIL_SUCCESS,
} from "./authConsts";
import Cookies from "js-cookie";

const initialState = {
  token: Cookies.get("token"),
  userLoggedIn: Cookies.get("userLoggedIn") == "true",
  emailVerified: Cookies.get("emailVerified") == "true",
  callingVerified: Cookies.get("callingVerified") == "true",
  whatsAppVerified: Cookies.get("whatsAppVerified") == "true",
  userLoggingIn: false,
  userLoading: false,
  userLoaded: false,
  userName: Cookies.get("userName") || "",
  userId: Cookies.get("userId") || "",
  recoverMsg: "",
  loginError: "",
  signupError: "",
  recoverError: "",
  isAdmin: false,
  profileImg: "",
  sendingVerificationEmail: false,
  redirectToVerifyEmail: false,
};

const authReducer = (state = initialState, action) => {
  // console.log(action);
  switch (action.type) {
    case LOAD_USER_REQUEST:
      return { ...state, userLoading: true };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        userLoggedIn: true,
        userLoading: false,
        userLoaded: true,
        emailVerified: action.payload.emailVerified,
        callingVerified: action.payload.callingVerified,
        whatsAppVerified: action.payload.whatsAppVerified,
        userName: action.payload.name,
        userId: action.payload._id,
        recoverMsg: "",
        loginError: "",
        signupError: "",
        recoverError: "",
        isAdmin: action.payload.isAdmin || false,
        profileImg: action.payload.profilePhoto,
      };
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
    case RECOVER_REQUEST:
      return {
        ...state,
        userLoggingIn: true,
        loginError: "",
        signupError: "",
        recoverError: "",
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userLoggedIn: false,
        emailVerified: false,
        callingVerified: false,
        whatsAppVerified: false,
        userLoggingIn: false,
        redirectToVerifyEmail: true,
        loginError: "",
        signupError: "",
        recoverError: "",
        isAdmin: action.payload.isAdmin || false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userLoggedIn: true,
        userLoaded: true,
        emailVerified: action.payload.emailVerified,
        callingVerified: action.payload.callingVerified,
        whatsAppVerified: action.payload.whatsAppVerified,
        userLoggingIn: false,
        loginError: "",
        signupError: "",
        recoverError: "",
        isAdmin: action.payload.isAdmin || false,
        profileImg: action.payload.profilePhoto,
        userName: action.payload.userName,
        userId: action.payload.userId,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        token: null,
        userLoggingIn: false,
        loginError: action.payload,
        recoverError: "",
        signupError: "",
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        token: null,
        userLoggingIn: false,
        loginError: "",
        recoverError: "",
        signupError: action.payload,
      };
    case RECOVER_ERROR:
      return {
        ...state,
        token: null,
        userLoggingIn: false,
        loginError: "",
        recoverError: action.payload,
        signupError: "",
      };
    case RECOVER_SUCCESS:
      return {
        ...state,
        token: null,
        userLoggingIn: false,
        loginError: "",
        recoverError: "",
        signupError: "",
        recoverMsg: action.payload,
      };
    case LOGOUT_SUCCESS:
    case LOAD_USER_ERROR:
      return {
        ...state,
        token: null,
        userLoading: false,
        userLoaded: true,
        userLoggingIn: false,
        userLoggedIn: false,
        emailVerified: false,
        phoneNumberVerified: false,
      };
    case CLEAR_MSGS:
      return {
        ...state,
        recoverError: "",
        signupError: "",
        loginError: "",
        recoverMsg: "",
      };
    case SEND_VERIFICATION_EMAIL_REQUEST:
      return { ...state, sendingVerificationEmail: true };
    case SEND_VERIFICATION_EMAIL_SUCCESS:
      return { ...state, sendingVerificationEmail: false };
    default:
      return state;
  }
};
export { authReducer, initialState as initialAuthState };

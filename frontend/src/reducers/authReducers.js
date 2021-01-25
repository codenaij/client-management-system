import {
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REGISTER_FAIL,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_RESET,
  AUTH_PASSWORD_UPDATE_REQUEST,
  AUTH_PASSWORD_UPDATE_SUCCESS,
  AUTH_PASSWORD_UPDATE_FAIL,
  AUTH_PASSWORD_UPDATE_RESET,
} from "../constants/authConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return { loading: true };
    case AUTH_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case AUTH_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case AUTH_LOGOUT:
      return {};
    case AUTH_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const updatePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH_PASSWORD_UPDATE_REQUEST:
      return { loading: true };
    case AUTH_PASSWORD_UPDATE_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case AUTH_PASSWORD_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case AUTH_PASSWORD_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH_REGISTER_REQUEST:
      return { loading: true };
    case AUTH_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case AUTH_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case AUTH_LOGOUT:
      return {};
    default:
      return state;
  }
};

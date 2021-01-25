import axios from "axios";
import {
  AUTH_LOGIN_FAIL,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_PASSWORD_UPDATE_FAIL,
  AUTH_PASSWORD_UPDATE_REQUEST,
  AUTH_PASSWORD_UPDATE_SUCCESS,
  AUTH_REGISTER_FAIL,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
} from "../constants/authConstants";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: AUTH_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/auth/login",
      { email, password },
      config
    );

    dispatch({
      type: AUTH_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: AUTH_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const registerContributor = (
  firstName,
  lastName,
  otherName,
  email,
  branch
) => async (dispatch) => {
  try {
    dispatch({
      type: AUTH_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/auth/register",
      {
        firstName,
        lastName,
        otherName,
        email,
        branch,
      },
      config
    );

    dispatch({
      type: AUTH_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateMyPassword = (
  oldPassword,
  newPassword,
  newPasswordConfirm
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTH_PASSWORD_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.patch(
      "/api/v1/auth/updateMyPassword",
      {
        oldPassword,
        newPassword,
        newPasswordConfirm,
      },
      config
    );

    dispatch({
      type: AUTH_PASSWORD_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_PASSWORD_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: AUTH_LOGOUT });

  document.location.href = "/login";
};

import axios from 'axios';
import {
  AUTH_REGISTER_FAIL,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
} from '../constants/authConstants';
import {
  STAFF_DETAILS_FAIL,
  STAFF_DETAILS_REQUEST,
  STAFF_DETAILS_SUCCESS,
  STAFF_LIST_FAIL,
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
} from '../constants/staffConstants';

export const registerStaff = (
  firstName,
  lastName,
  otherName,
  email,
  password,
  passwordConfirm,
  role,
  branch
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: AUTH_REGISTER_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      '/api/v1/auth/register',
      {
        firstName,
        lastName,
        otherName,
        email,
        password,
        passwordConfirm,
        role,
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

export const listAllStaff = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STAFF_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/auth`, config);

    dispatch({
      type: STAFF_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STAFF_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listStaffDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: STAFF_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/auth/${id}`, config);

    dispatch({
      type: STAFF_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STAFF_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

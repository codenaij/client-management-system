import axios from "axios";
import {
  BRANCH_CREATE_FAIL,
  BRANCH_CREATE_REQUEST,
  BRANCH_CREATE_SUCCESS,
  BRANCH_DETAILS_FAIL,
  BRANCH_DETAILS_REQUEST,
  BRANCH_DETAILS_SUCCESS,
  BRANCH_LIST_FAIL,
  BRANCH_LIST_REQUEST,
  BRANCH_LIST_SUCCESS,
} from "../constants/branchConstants";
import { logout } from "./authActions";

export const createBranch = (name, coopName, code, address, region) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: BRANCH_CREATE_REQUEST,
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

    const { data } = await axios.post(
      `api/v1/branches`,
      { name, coopName, code, address, region },
      config
    );

    dispatch({
      type: BRANCH_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    //     if (message === 'Not authorized, token failed') {
    //         dispatch(logout());
    // }
    dispatch({
      type: BRANCH_CREATE_FAIL,
      payload: message,
    });
  }
};

// List all the branches

export const listBranches = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BRANCH_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/branches`, config);

    dispatch({
      type: BRANCH_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRANCH_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// export const branchListDetails = (id) => async (dispatch) => {
//   try {
//     dispatch({ type: BRANCH_DETAILS_REQUEST });

//     const { data } = await axios.get(`/api/v1/branches/${id}`);

//     dispatch({
//       type: BRANCH_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: BRANCH_DETAILS_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

export const branchListDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRANCH_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/branches/${id}`, config);

    dispatch({
      type: BRANCH_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "jwt expired") {
      dispatch(logout());
    }
    dispatch({
      type: BRANCH_DETAILS_FAIL,
      payload: message,
    });
  }
};

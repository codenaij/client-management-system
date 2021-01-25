import axios from "axios";
import {
  CONTRIBUTOR_DETAILS_REQUEST,
  CONTRIBUTOR_DETAILS_SUCCESS,
  CONTRIBUTOR_DETAILS_FAIL,
  CONTRIBUTOR_LIST_REQUEST,
  CONTRIBUTOR_LIST_SUCCESS,
  CONTRIBUTOR_LIST_FAIL,
  CONTRIBUTOR_CREATE_SUCCESS,
  CONTRIBUTOR_CREATE_FAIL,
  CONTRIBUTOR_CREATE_REQUEST,
} from "../constants/contributorConstants";

export const createContributor = (
  branch,
  fullName,
  minor,
  company,
  maritalStatus,
  gender,
  phone,
  email,
  dob,
  occupation,
  organisation,
  meansIdentification,
  address,
  busStop,
  city,
  stateResidence,
  nationality,
  stateOrigin,
  lga,
  kinName,
  kinPhone,
  kinAddress,
  bankName,
  accountName,
  accountNumber,
  createdBy
) => async (dispatch, getState) => {
  try {
    dispatch({ type: CONTRIBUTOR_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(
      `/api/v1/customers`,
      {
        branch,
        fullName,
        minor,
        company,
        maritalStatus,
        gender,
        phone,
        email,
        dob,
        occupation,
        organisation,
        meansIdentification,
        address,
        busStop,
        city,
        stateResidence,
        nationality,
        stateOrigin,
        lga,
        kinName,
        kinPhone,
        kinAddress,
        bankName,
        accountName,
        accountNumber,
        createdBy,
      },
      config
    );

    dispatch({
      type: CONTRIBUTOR_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CONTRIBUTOR_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listAllContributors = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CONTRIBUTOR_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/customers`, config);

    dispatch({
      type: CONTRIBUTOR_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CONTRIBUTOR_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listAllContributorsSearch = (name = "") => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: CONTRIBUTOR_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      // `/api/v1/customers?fullName=${name}`,
      `/api/v1/customers`,
      config
    );

    dispatch({
      type: CONTRIBUTOR_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CONTRIBUTOR_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const contributorListDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CONTRIBUTOR_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/customers/${id}`, config);

    dispatch({
      type: CONTRIBUTOR_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CONTRIBUTOR_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

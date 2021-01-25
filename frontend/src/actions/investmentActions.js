import axios from "axios";
import {
  INVESTMENT_CONFIRM_FAIL,
  INVESTMENT_CONFIRM_REQUEST,
  INVESTMENT_CONFIRM_SUCCESS,
  INVESTMENT_CREATE_FAIL,
  INVESTMENT_CREATE_REQUEST,
  INVESTMENT_CREATE_SUCCESS,
  INVESTMENT_DETAILS_FAIL,
  INVESTMENT_DETAILS_REQUEST,
  INVESTMENT_DETAILS_SUCCESS,
  INVESTMENT_LIST_FAIL,
  INVESTMENT_LIST_REQUEST,
  INVESTMENT_LIST_SUCCESS,
  INVESTMENT_UPDATE_FAIL,
  INVESTMENT_UPDATE_REQUEST,
  INVESTMENT_UPDATE_SUCCESS,
  MOU_CREATE_FAIL,
  MOU_CREATE_REQUEST,
  MOU_CREATE_SUCCESS,
  RECEIPT_CREATE_FAIL,
  RECEIPT_CREATE_REQUEST,
  RECEIPT_CREATE_SUCCESS,
} from "../constants/investmentConstants";

import { logout } from "./authActions";

// Create new investment

export const createInvestment = (
  customer,
  dateInvestVerify,
  officialBank,
  note,
  investmentAmount,
  investmentDuration,
  paymentDates,
  createdBy
) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVESTMENT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/investments`,
      {
        customer,
        dateInvestVerify,
        officialBank,
        note,
        investmentAmount,
        investmentDuration,
        paymentDates,
        createdBy,
      },
      config
    );

    dispatch({
      type: INVESTMENT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVESTMENT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List All Investments
export const listAllInvestments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: INVESTMENT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/investments`, config);
    // `/api/v1/investments?paymentDates=${date}`

    dispatch({
      type: INVESTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVESTMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List all investments for due dates
export const listAllInvestmentsDue = (
  date = "",
  roi = "investmentAmount"
) => async (dispatch) => {
  try {
    dispatch({ type: INVESTMENT_LIST_REQUEST });

    const { data } = await axios.get(
      `/api/v1/investments?paymentDates=${date}&sort=${roi}`
    );
    // `/api/v1/investments?paymentDates=${date}`

    dispatch({
      type: INVESTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVESTMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List all investments Summary
export const listAllInvestmentsSummary = (
  startDate = "",
  endDate = ""
) => async (dispatch) => {
  try {
    dispatch({ type: INVESTMENT_LIST_REQUEST });

    const { data } = await axios.get(
      `/api/v1/investments?paymentDates[gte]=${startDate}&paymentDates=${endDate}`
    );
    // `/api/v1/investments?paymentDates=${date}`

    dispatch({
      type: INVESTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: INVESTMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// List an investment details
export const investmentListDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: INVESTMENT_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/investments/${id}`, config);

    dispatch({
      type: INVESTMENT_DETAILS_SUCCESS,
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
      type: INVESTMENT_DETAILS_FAIL,
      payload: message,
    });
  }
};

// Confirm investment
export const investmentConfirm = (
  investId,
  isConfirmed,
  dateConfirmed,
  userConfirmed,
  paymentDates,
  note
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: INVESTMENT_CONFIRM_REQUEST,
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
      `/api/v1/investments/confirm-payment/${investId}`,
      // `/api/v1/investments/${investId}`,
      {
        investmentVerified: isConfirmed,
        dateInvestVerify: dateConfirmed,
        confirmedBy: userConfirmed,
        paymentDates: paymentDates,
        note: note,
      },
      config
    );

    dispatch({
      type: INVESTMENT_CONFIRM_SUCCESS,
      payload: data,
    });
    // dispatch({ type: INVESTMENT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    // if (message === 'Not authorized, token failed') {
    //   dispatch(logout())
    // }
    dispatch({
      type: INVESTMENT_CONFIRM_FAIL,
      payload: message,
    });
  }
};

// Generate receipt for investment

export const receiptGenerate = (
  investId,
  invoicePrepared,
  invoicePreparedBy,
  dateInvoicePrepared,
  issuer,
  receiptGenerateNote
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RECEIPT_CREATE_REQUEST,
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
      `/api/v1/investments/invoice/${investId}`,
      {
        invoicePrepared,
        invoicePreparedBy,
        dateInvoicePrepared,
        issuer,
        receiptGenerateNote,
      },
      config
    );
    dispatch({ type: RECEIPT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: RECEIPT_CREATE_FAIL,
      payload: message,
    });
  }
};

// Generate MOU for investment
export const mouGenerate = (
  investId,
  mouPrepared,
  mouPreparedBy,
  dateMouPrepared,
  mouGenerateNote
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MOU_CREATE_REQUEST,
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
      `/api/v1/investments/mou/${investId}`,
      {
        mouPrepared,
        mouPreparedBy,
        dateMouPrepared,
        mouGenerateNote,
      },
      config
    );
    dispatch({ type: MOU_CREATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: MOU_CREATE_FAIL,
      payload: message,
    });
  }
};

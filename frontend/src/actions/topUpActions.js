import axios from "axios";
import {
  RECEIPT_CREATE_FAIL,
  RECEIPT_CREATE_REQUEST,
  RECEIPT_CREATE_SUCCESS,
} from "../constants/investmentConstants";
import {
  TOPUP_CREATE_FAIL,
  TOPUP_CREATE_REQUEST,
  TOPUP_CREATE_SUCCESS,
  TOPUP_DETAILS_FAIL,
  TOPUP_DETAILS_REQUEST,
  TOPUP_DETAILS_SUCCESS,
  TOPUP_CONFIRM_FAIL,
  TOPUP_CONFIRM_SUCCESS,
  TOPUP_CONFIRM_REQUEST,
  TOPUP_LIST_SUCCESS,
  TOPUP_LIST_FAIL,
  TOPUP_LIST_REQUEST,
} from "../constants/topUpConstants";
import { logout } from "./authActions";

export const createTopUp = (
  investId,
  topUpAmount,
  topDate,
  bankPayment,
  user,
  customer
) => async (dispatch, getState) => {
  try {
    dispatch({ type: TOPUP_CREATE_REQUEST });

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
      `/api/v1/topUp`,
      {
        investment: investId,
        officialBank: bankPayment,
        topUpAmount: topUpAmount,
        createdBy: user,
        topDate: topDate,
        customer: customer,
      },
      config
    );

    dispatch({
      type: TOPUP_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TOPUP_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listAllTopUps = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TOPUP_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/topup`, config);

    dispatch({
      type: TOPUP_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TOPUP_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const topUpListDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: TOPUP_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/v1/topup/${id}`, config);

    dispatch({
      type: TOPUP_DETAILS_SUCCESS,
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
      type: TOPUP_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const topUpConfirm = (
  topUpId,
  isConfirmed,
  dateConfirmed,
  userConfirmed,
  note,
  confirmedBy
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TOPUP_CONFIRM_REQUEST,
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
      `/api/v1/topup/${topUpId}`,
      {
        topUpVerified: isConfirmed,
        dateTopUpVerify: dateConfirmed,
        verifiedBy: userConfirmed,
        note: note,
      },
      config
    );

    dispatch({
      type: TOPUP_CONFIRM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    // if (message === 'Not authorized, token failed') {
    //   dispatch(logout())
    // }
    dispatch({
      type: TOPUP_CONFIRM_FAIL,
      payload: message,
    });
  }
};

export const receiptTopGenerate = (
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
      `/api/v1/topup/invoice/${investId}`,
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

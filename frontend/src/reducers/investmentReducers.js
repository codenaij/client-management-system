import {
  INVESTMENT_CONFIRM_FAIL,
  INVESTMENT_CONFIRM_REQUEST,
  INVESTMENT_CONFIRM_RESET,
  INVESTMENT_CONFIRM_SUCCESS,
  INVESTMENT_CREATE_FAIL,
  INVESTMENT_CREATE_REQUEST,
  INVESTMENT_CREATE_RESET,
  INVESTMENT_CREATE_SUCCESS,
  INVESTMENT_DETAILS_FAIL,
  INVESTMENT_DETAILS_REQUEST,
  INVESTMENT_DETAILS_SUCCESS,
  INVESTMENT_LIST_FAIL,
  INVESTMENT_LIST_REQUEST,
  INVESTMENT_LIST_SUCCESS,
  INVESTMENT_UPDATE_FAIL,
  INVESTMENT_UPDATE_REQUEST,
  INVESTMENT_UPDATE_RESET,
  INVESTMENT_UPDATE_SUCCESS,
  MOU_CREATE_FAIL,
  MOU_CREATE_REQUEST,
  MOU_CREATE_RESET,
  MOU_CREATE_SUCCESS,
  RECEIPT_CREATE_FAIL,
  RECEIPT_CREATE_REQUEST,
  RECEIPT_CREATE_RESET,
  RECEIPT_CREATE_SUCCESS,
} from "../constants/investmentConstants";

export const investmentCreateReducer = (state = { investment: {} }, action) => {
  switch (action.type) {
    case INVESTMENT_CREATE_REQUEST:
      return { loading: true, investment: {} };
    case INVESTMENT_CREATE_SUCCESS:
      return { loading: false, success: true, investment: action.payload };
    case INVESTMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case INVESTMENT_CREATE_RESET:
      return { investment: {} };
    default:
      return state;
  }
};

export const investmentListReducer = (
  state = { allInvestments: [] },
  action
) => {
  switch (action.type) {
    case INVESTMENT_LIST_REQUEST:
      return { loading: true, allInvestments: [] };
    case INVESTMENT_LIST_SUCCESS:
      return { loading: false, allInvestments: action.payload };
    case INVESTMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const investmentDetailsReducer = (
  state = { investment: {} },
  action
) => {
  switch (action.type) {
    case INVESTMENT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case INVESTMENT_DETAILS_SUCCESS:
      return { loading: false, investment: action.payload };
    case INVESTMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const investmentConfirmReducer = (
  // state = {},
  state = { investment: {} },
  action
) => {
  switch (action.type) {
    case INVESTMENT_CONFIRM_REQUEST:
      return { ...state, loading: true };
    case INVESTMENT_CONFIRM_SUCCESS:
      return { loading: false, success: true, investment: action.payload };
    case INVESTMENT_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case INVESTMENT_CONFIRM_RESET:
      return {};
    default:
      return state;
  }
};

export const receiptGenerateReducer = (state = { investment: {} }, action) => {
  switch (action.type) {
    case RECEIPT_CREATE_REQUEST:
      return { ...state, loading: true };
    case RECEIPT_CREATE_SUCCESS:
      return { loading: false, success: true, investment: action.payload };
    case RECEIPT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case RECEIPT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
export const mouGenerateReducer = (state = { investment: {} }, action) => {
  switch (action.type) {
    case MOU_CREATE_REQUEST:
      return { ...state, loading: true };
    case MOU_CREATE_SUCCESS:
      return { loading: false, success: true, investment: action.payload };
    case MOU_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case MOU_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const investmentUpdateReducer = (state = { investment: {} }, action) => {
  switch (action.type) {
    case INVESTMENT_UPDATE_REQUEST:
      return { loading: true };
    case INVESTMENT_UPDATE_SUCCESS:
      return { loading: false, success: true, investment: action.payload };
    case INVESTMENT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case INVESTMENT_UPDATE_RESET:
      return { investment: {} };
    default:
      return state;
  }
};

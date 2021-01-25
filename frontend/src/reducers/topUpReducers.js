import {
  TOPUP_CONFIRM_FAIL,
  TOPUP_CONFIRM_REQUEST,
  TOPUP_CONFIRM_RESET,
  TOPUP_CONFIRM_SUCCESS,
  TOPUP_CREATE_FAIL,
  TOPUP_CREATE_REQUEST,
  TOPUP_CREATE_RESET,
  TOPUP_CREATE_SUCCESS,
  TOPUP_DETAILS_FAIL,
  TOPUP_DETAILS_REQUEST,
  TOPUP_DETAILS_SUCCESS,
  TOPUP_LIST_FAIL,
  TOPUP_LIST_REQUEST,
  TOPUP_LIST_SUCCESS,
} from '../constants/topUpConstants';

export const topUpCreateReducer = (state = { topup: {} }, action) => {
  switch (action.type) {
    case TOPUP_CREATE_REQUEST:
      return { loading: true, topup: {} };
    case TOPUP_CREATE_SUCCESS:
      return { loading: false, topup: action.payload };
    case TOPUP_CREATE_FAIL:
      return { loading: false, topup: action.payload };
    case TOPUP_CREATE_RESET:
      return { topUp: {} };
    default:
      return state;
  }
};

export const topUpDetailsReducer = (state = { topup: {} }, action) => {
  switch (action.type) {
    case TOPUP_DETAILS_REQUEST:
      return { ...state, loading: true };
    case TOPUP_DETAILS_SUCCESS:
      return { loading: false, topup: action.payload };
    case TOPUP_DETAILS_FAIL:
      return { loading: false, topup: action.payload };
    default:
      return state;
  }
};

export const topUpListReducer = (state = { allTopUps: [] }, action) => {
  switch (action.type) {
    case TOPUP_LIST_REQUEST:
      return { loading: true, allTopUps: [] };
    case TOPUP_LIST_SUCCESS:
      return { loading: false, allTopUps: action.payload };
    case TOPUP_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const topUpConfirmReducer = (state = { topUp: {} }, action) => {
  switch (action.type) {
    case TOPUP_CONFIRM_REQUEST:
      return { ...state, loading: true };
    case TOPUP_CONFIRM_SUCCESS:
      return { loading: false, success: true, topUp: action.payload };
    case TOPUP_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case TOPUP_CONFIRM_RESET:
      return {};
    default:
      return state;
  }
};

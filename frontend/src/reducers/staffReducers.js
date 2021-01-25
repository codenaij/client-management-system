import {
  STAFF_REGISTER_FAIL,
  STAFF_REGISTER_REQUEST,
  STAFF_REGISTER_RESET,
  STAFF_REGISTER_SUCCESS,
} from '../constants/staffConstants';
import {
  STAFF_LIST_REQUEST,
  STAFF_LIST_SUCCESS,
  STAFF_LIST_FAIL,
  STAFF_DETAILS_REQUEST,
  STAFF_DETAILS_SUCCESS,
  STAFF_DETAILS_FAIL,
} from '../constants/staffConstants';

export const staffRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case STAFF_REGISTER_REQUEST:
      return { loading: true };
    case STAFF_REGISTER_SUCCESS:
      return { loading: false, staffInfo: action.payload };
    case STAFF_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case STAFF_REGISTER_RESET:
      return { state };
    default:
      return state;
  }
};

export const staffListReducer = (state = { allStaff: [] }, action) => {
  switch (action.type) {
    case STAFF_LIST_REQUEST:
      return { loading: true, allStaff: [] };
    case STAFF_LIST_SUCCESS:
      return { loading: false, allStaff: action.payload };
    case STAFF_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const staffDetailsReducer = (state = { staff: {} }, action) => {
  switch (action.type) {
    case STAFF_DETAILS_REQUEST:
      return { ...state, loading: true };
    case STAFF_DETAILS_SUCCESS:
      return { loading: false, staff: action.payload };
    case STAFF_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

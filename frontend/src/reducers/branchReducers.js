import {
  BRANCH_CREATE_FAIL,
  BRANCH_CREATE_REQUEST,
  BRANCH_CREATE_RESET,
  BRANCH_CREATE_SUCCESS,
  BRANCH_DETAILS_FAIL,
  BRANCH_DETAILS_REQUEST,
  BRANCH_DETAILS_SUCCESS,
  BRANCH_LIST_FAIL,
  BRANCH_LIST_REQUEST,
  BRANCH_LIST_SUCCESS,
} from '../constants/branchConstants';

export const branchCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BRANCH_CREATE_REQUEST:
      return { loading: true };
    case BRANCH_CREATE_SUCCESS:
      return { loading: false, success: true, branch: action.payload };
    case BRANCH_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case BRANCH_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const branchListReducer = (state = { branches: [] }, action) => {
  switch (action.type) {
    case BRANCH_LIST_REQUEST:
      return { loading: true, branches: [] };
    case BRANCH_LIST_SUCCESS:
      return {
        loading: false,
        branches: action.payload,
      };
    case BRANCH_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const branchDetailsReducer = (state = { branch: {} }, action) => {
  switch (action.type) {
    case BRANCH_DETAILS_REQUEST:
      return { loading: true, branch: {} };
    case BRANCH_DETAILS_SUCCESS:
      return {
        loading: false,
        branch: action.payload,
      };
    case BRANCH_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

import {
  CONTRIBUTOR_CREATE_FAIL,
  CONTRIBUTOR_CREATE_REQUEST,
  CONTRIBUTOR_CREATE_SUCCESS,
  CONTRIBUTOR_CREATE_RESET,
  CONTRIBUTOR_LIST_REQUEST,
  CONTRIBUTOR_LIST_SUCCESS,
  CONTRIBUTOR_LIST_FAIL,
  CONTRIBUTOR_DETAILS_REQUEST,
  CONTRIBUTOR_DETAILS_SUCCESS,
  CONTRIBUTOR_DETAILS_FAIL,
  CONTRIBUTOR_DETAILS_RESET,
} from "../constants/contributorConstants";

export const contributorCreateReducer = (
  state = { contributor: {} },
  action
) => {
  switch (action.type) {
    case CONTRIBUTOR_CREATE_REQUEST:
      return { loading: true, contributor: {} };
    case CONTRIBUTOR_CREATE_SUCCESS:
      return { loading: false, success: true, contributor: action.payload };
    case CONTRIBUTOR_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case CONTRIBUTOR_CREATE_RESET:
      return { contributor: {} };
    default:
      return state;
  }
};

export const contributorDetailsReducer = (
  state = { contributor: { investment: { topUp: [] } } },
  action
) => {
  switch (action.type) {
    case CONTRIBUTOR_DETAILS_REQUEST:
      return { ...state, loading: true };
    case CONTRIBUTOR_DETAILS_SUCCESS:
      return { loading: false, contributor: action.payload };
    case CONTRIBUTOR_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CONTRIBUTOR_DETAILS_RESET:
      return { contributor: {} };
    default:
      return state;
  }
};

export const contributorListReducer = (
  state = { allContributors: [] },
  action
) => {
  switch (action.type) {
    case CONTRIBUTOR_LIST_REQUEST:
      return { loading: true, allContributors: [] };
    case CONTRIBUTOR_LIST_SUCCESS:
      return { loading: false, allContributors: action.payload };
    case CONTRIBUTOR_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

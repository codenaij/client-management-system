import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  branchCreateReducer,
  branchListReducer,
  branchDetailsReducer,
} from "./reducers/branchReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  updatePasswordReducer,
} from "./reducers/authReducers";
import {
  staffRegisterReducer,
  staffListReducer,
  staffDetailsReducer,
} from "./reducers/staffReducers";
import {
  contributorDetailsReducer,
  contributorCreateReducer,
  contributorListReducer,
} from "./reducers/contributorReducers";
import {
  investmentCreateReducer,
  investmentDetailsReducer,
  investmentListReducer,
  investmentConfirmReducer,
  investmentUpdateReducer,
  receiptGenerateReducer,
  mouGenerateReducer,
} from "./reducers/investmentReducers";
import {
  topUpCreateReducer,
  topUpDetailsReducer,
  topUpConfirmReducer,
  topUpListReducer,
} from "./reducers/topUpReducers";

const reducer = combineReducers({
  branchCreate: branchCreateReducer,
  branchList: branchListReducer,
  branchDetails: branchDetailsReducer,
  staffRegister: staffRegisterReducer,
  staffList: staffListReducer,
  staffDetails: staffDetailsReducer,
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
  contributorDetails: contributorDetailsReducer,
  contributorCreate: contributorCreateReducer,
  contributorList: contributorListReducer,
  investmentCreate: investmentCreateReducer,
  investmentList: investmentListReducer,
  investmentDetails: investmentDetailsReducer,
  investmentConfirm: investmentConfirmReducer,
  investmentUpdate: investmentUpdateReducer,
  receiptGenerate: receiptGenerateReducer,
  mouGenerate: mouGenerateReducer,
  topUpCreate: topUpCreateReducer,
  topUpDetails: topUpDetailsReducer,
  topUpConfirm: topUpConfirmReducer,
  topUpList: topUpListReducer,
  updatePassword: updatePasswordReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = { userLogin: { userInfo: userInfoFromStorage } };

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

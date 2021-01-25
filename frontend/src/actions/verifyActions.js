import axios from 'axios';
import {
  VERIFY_CREATE_FAIL,
  VERIFY_CREATE_REQUEST,
  VERIFY_CREATE_SUCCESS,
} from '../constants/verifyConstants';

export const verifyInvestment = (
  verified,
  investment,
  dateVerify,
  verifiedBy,
  amount,
  duration,
  paymentDates,
  note
) => async (dispatch, getState) => {
  try {
    dispatch({ type: VERIFY_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        // Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `/api/v1/verify`,
      {
        verified,
        investment,
        dateVerify,
        verifiedBy,
        amount,
        duration,
        paymentDates,
        note,
      },
      config
    );

    dispatch({
      type: VERIFY_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: VERIFY_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

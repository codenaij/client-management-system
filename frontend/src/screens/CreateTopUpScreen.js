import React, { useState, useEffect } from 'react';
import { Form, Button, FormGroup, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { investmentListDetails } from '../actions/investmentActions';
import { createTopUp } from '../actions/topUpActions';
import { TOPUP_CREATE_RESET } from '../constants/topUpConstants';

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const CreateTopUpScreen = ({ match, history }) => {
  const [bankPayment, setBankPayment] = useState('');
  const [topDate, setTopDate] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [baraNumber, setBaraNumber] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const investmentDetails = useSelector((state) => state.investmentDetails);
  const { error, loading, investment } = investmentDetails;

  const topUpCreate = useSelector((state) => state.topUpCreate);
  const {
    loading: topUpCreateLoading,
    error: topUpCreateError,
    topUp,
  } = topUpCreate;

  useEffect(() => {
    if (userInfo && userInfo.data.user.role === 'super-admin') {
      dispatch(investmentListDetails(match.params.id));
    } else {
      history.push('/login');
    }
  }, [match, dispatch, history, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    // const data = new FormData();
    // data.append('investment', investment._id);
    // data.append('topUpAmount', topUpAmount);
    // data.append('createdAt', topDate);
    // data.append('officialBank', bankPayment);
    // // data.append('paymentProof', proofPayment);
    // data.append('createdBy', userInfo.data.user._id);

    dispatch(
      createTopUp(
        investment._id,
        topUpAmount,
        topDate,
        bankPayment,
        userInfo.data.user._id,
        investment?.customer._id
      )
    );
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-shekel-sign"></i> NEW TopUp
      </h1>
      {loading ? (
        <Loader /> ? (
          error
        ) : (
          <Message variant="danger">{error}</Message>
        )
      ) : (
        <Form onSubmit={submitHandler}>
          <Card>
            <ListGroup>
              <Card.Body>
                <ListGroup.Item>
                  <h2>Contributor Details</h2>
                  <Form.Group controlId="account-number">
                    <Form.Label>Bara Account Number:</Form.Label>
                    <Form.Control
                      type="select"
                      value={baraNumber}
                      onChange={(e) => setBaraNumber(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="branch">
                    <Form.Label>Branch:</Form.Label>
                    <Form.Control
                      type="text"
                      value={investment?.customer?.branch?.name}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="bank-payment">
                    <Form.Label>Investment Officer:</Form.Label>
                    <Form.Control
                      type="text"
                      value={`${investment?.investmentOfficer?.firstName} ${
                        investment?.investmentOfficer?.lastName
                      } ${investment?.investmentOfficer?.otherName || ''}`}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="full-name">
                    <Form.Label>Full Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={investment?.customer?.fullName}
                      disabled
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="bank-name">
                    <Form.Label>Bank Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={investment?.customer?.bankName}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="account-name">
                    <Form.Label>Account Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Account Name"
                      value={investment?.customer?.accountName}
                      disabled
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="account-number">
                    <Form.Label>Enter Account Number:</Form.Label>
                    <Form.Control
                      type="text"
                      value={investment?.customer?.accountNumber}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </ListGroup.Item>
              </Card.Body>

              <Card.Body>
                <ListGroup.Item>
                  <h2>New TopUp</h2>
                  <Form.Group controlId="top">
                    <Form.Label>Top-Up Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={topDate}
                      onChange={(e) => setTopDate(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="topup-amout">
                    <Form.Label>TopUp Amount:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter TopUp Amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="bank-payment">
                    <Form.Label>Bank Paid Into:</Form.Label>
                    <Form.Control
                      as="select"
                      value={bankPayment}
                      onChange={(e) => setBankPayment(e.target.value)}
                    >
                      <option value="">Select Bank of Payment</option>
                      <option value="Access Bank Plc">Access Bank Plc</option>
                      <option value="Guaranty Trust Bank Plc">
                        Guaranty Trust Bank Plc
                      </option>
                      <option value="Sterling Bank Plc">
                        Sterling Bank Plc
                      </option>
                      <option value="SunTrust Bank Nigeria Limited">
                        SunTrust Bank Nigeria Limited
                      </option>
                      <option value="United Bank for Africa Plc">
                        United Bank for Africa Plc
                      </option>
                      <option value="Unity Bank Plc">Unity Bank Plc</option>
                      <option value="Wema Bank Plc">Wema Bank Plc</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.File
                      id="custom-file"
                      custom
                      label="Upload Proof of TopUp Payment"
                    />
                  </Form.Group>
                  <Form.Group controlId="bank-payment">
                    <Form.Label>Created By:</Form.Label>
                    <Form.Control
                      type="text"
                      value={`${userInfo.data.user.firstName} ${
                        userInfo.data.user.lastName
                      } ${userInfo.data.user.otherName || ''}`}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </ListGroup.Item>
              </Card.Body>
            </ListGroup>
          </Card>

          <Button type="submit" variant="primary" block>
            Create Top-Up
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default CreateTopUpScreen;

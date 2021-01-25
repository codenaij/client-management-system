import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import moment from "moment";
import { INVESTMENT_CONFIRM_RESET } from "../constants/investmentConstants";
import {
  investmentConfirm,
  investmentListDetails,
} from "../actions/investmentActions";

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const ContributionConfirmScreen = ({ match, history }) => {
  const [bankPayment, setBankPayment] = useState("");
  const [dateConfirm, setDateConfirm] = useState("");
  const [baraNumber, setBaraNumber] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [note, setNote] = useState("");

  const dispatch = useDispatch();

  const investmentDetails = useSelector((state) => state.investmentDetails);
  const { loading, error, investment } = investmentDetails;
  const investmentConfirmed = useSelector((state) => state.investmentConfirm);
  const {
    loading: loadingConfirm,
    error: errorConfirm,
    success,
    investment: confirmInvestment,
  } = investmentConfirmed;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(investmentListDetails(match.params.id));
    if (confirmInvestment) {
      window.alert(`Contribution Confirmed`);
      dispatch({ type: INVESTMENT_CONFIRM_RESET });
      history.push("/");
    }
  }, [match, dispatch, confirmInvestment, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isConfirmed === true && dateConfirm !== "") {
      const paymentDates = [];
      for (let i = 1; i <= investment.investmentDuration; i += 1) {
        paymentDates.push(
          moment(dateConfirm)
            .add(i, "months")
            // .add(1, 'days')
            .format("YYYY-MM-DD")
        );
      }
      dispatch(
        investmentConfirm(
          investment._id,
          isConfirmed,
          dateConfirm,
          userInfo.data.user._id,
          paymentDates,
          note
        )
      );
      // history.push('/');
    }
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-check-double"></i> Confirm Payment
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {investment.investmentVerified === false ? (
            <>
              <Form onSubmit={submitHandler}>
                <Card>
                  <ListGroup>
                    <Card.Body>
                      <ListGroup.Item>
                        <h2>Contributor Details</h2>
                        <Form.Group controlId="branch">
                          <Form.Label>Branch:</Form.Label>
                          <Form.Control
                            type="text"
                            value={investment?.customer?.branch?.name}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="account-number">
                          <Form.Label>Bara Account Number:</Form.Label>
                          <Form.Control
                            type="select"
                            value={baraNumber}
                            onChange={(e) => setBaraNumber(e.target.value)}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="full-name">
                          <Form.Label>Contributor's Full Name:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Full Name"
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
                            value={investment?.customer?.accountName}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="account-number">
                          <Form.Label>Account Number:</Form.Label>
                          <Form.Control
                            type="text"
                            value={investment?.customer?.accountNumber}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="bank-payment">
                          <Form.Label>Bank Paid Into:</Form.Label>
                          <Form.Control
                            as="select"
                            value={bankPayment}
                            onChange={(e) => setBankPayment(e.target.value)}
                            disabled
                          >
                            <option value="access">Access Bank Plc</option>
                            <option value="gtb">Guaranty Trust Bank Plc</option>
                            <option value="sterling">Sterling Bank Plc</option>
                            <option value="suntrust">
                              SunTrust Bank Nigeria Limited
                            </option>
                            <option value="uba">
                              United Bank for Africa Plc
                            </option>
                            <option value="" unity>
                              Unity Bank Plc
                            </option>
                            <option value="wema">Wema Bank Plc</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="confirmed-amout">
                          <Form.Label>Amount to Confirm:</Form.Label>
                          <Form.Control
                            type="text"
                            value={`N${investment?.investmentAmount
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="type">
                          <Form.Label>Contribution Type:</Form.Label>
                          <Form.Control
                            type="text"
                            value={investment?.type}
                          ></Form.Control>
                        </Form.Group>
                      </ListGroup.Item>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup.Item>
                        <h2>Confirmation</h2>

                        <Form.Group controlId="is-confirmed">
                          <Form.Check
                            type="checkbox"
                            label="Confirm?"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                          ></Form.Check>
                        </Form.Group>
                        <Form.Group controlId="confirm-date">
                          <Form.Label>Confirmation Date:</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateConfirm}
                            onChange={(e) => setDateConfirm(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="confirm-note">
                          <Form.Label>Note:</Form.Label>
                          <Form.Control
                            as="textarea"
                            placeholder="Optional"
                            value={note}
                            rows={3}
                            onChange={(e) => setNote(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="bank-payment">
                          <Form.Label>Confirmed By:</Form.Label>
                          <Form.Control
                            type="text"
                            value={`${userInfo.data.user.firstName} ${
                              userInfo.data.user.lastName
                            } ${userInfo.data.user.otherName || ""}`}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                      </ListGroup.Item>
                    </Card.Body>
                  </ListGroup>
                </Card>

                <Button type="submit" variant="primary" block>
                  Confirm
                </Button>
              </Form>
            </>
          ) : (
            <Message variant="danger">Contribution is already verified</Message>
          )}
        </>
      )}
    </FormContainer>
  );
};

export default ContributionConfirmScreen;

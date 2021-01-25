import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Form, Button, FormGroup, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  receiptGenerate,
  investmentListDetails,
} from '../actions/investmentActions';
import { RECEIPT_CREATE_RESET } from '../constants/investmentConstants';

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const ReceiptGeneratorScreen = ({ match, history }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [note, setNote] = useState('');

  const dispatch = useDispatch();

  const investmentDetails = useSelector((state) => state.investmentDetails);
  const { loading, error, investment } = investmentDetails;

  const receiptGenerated = useSelector((state) => state.receiptGenerate);
  const { success } = receiptGenerated;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(investmentListDetails(match.params.id));
    if (success) {
      window.alert(`Receipt has been generated`);
      dispatch({ type: RECEIPT_CREATE_RESET });
      history.push('/');
    }
  }, [match, dispatch, history, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      receiptGenerate(
        investment._id,
        isGenerated,
        userInfo.data.user._id,
        moment().format(),
        `${userInfo.data.user.firstName} ${userInfo.data.user.lastName} ${
          userInfo.data.user.otherName || ''
        }`,
        note
      )
    );
  };
  return (
    <FormContainer>
      <h1>
        <i class="fas fa-receipt"></i> Generate Receipt
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {investment.investmentVerified === true &&
          investment.invoicePrepared === false ? (
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
                            value={investment?.customer?.baraNumber}
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
                        <Form.Group controlId="address">
                          <Form.Label>Contributor's Address:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Address"
                            value={investment?.customer?.address}
                            disabled
                          ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="receipt-amout">
                          <Form.Label>Amount to Generate Receipt:</Form.Label>
                          <Form.Control
                            type="text"
                            value={`N${investment?.investmentAmount
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="type">
                          <Form.Label>Contribution Type:</Form.Label>
                          <Form.Control
                            type="text"
                            value={investment?.type}
                            disabled
                          ></Form.Control>
                        </Form.Group>
                      </ListGroup.Item>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup.Item>
                        <h2>Receipt</h2>

                        <Form.Group controlId="is-confirmed">
                          <Form.Check
                            type="checkbox"
                            label="Generate Receipt?"
                            checked={isGenerated}
                            onChange={(e) => setIsGenerated(e.target.checked)}
                          ></Form.Check>
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
                          <Form.Label>Generated By:</Form.Label>
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
                  Generate Receipt
                </Button>
              </Form>
            </>
          ) : (
            <Message variant="danger">
              You can't generate receipt at this time
            </Message>
          )}
        </>
      )}
    </FormContainer>
  );
};

export default ReceiptGeneratorScreen;

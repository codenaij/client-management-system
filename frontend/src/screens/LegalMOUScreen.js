import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Form, Button, FormGroup, Card, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  mouGenerate,
  investmentListDetails,
} from '../actions/investmentActions';
import { MOU_CREATE_RESET } from '../constants/investmentConstants';

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const LegalMOUScreen = ({ match, history }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [note, setNote] = useState('');

  const dispatch = useDispatch();

  const investmentDetails = useSelector((state) => state.investmentDetails);
  const { loading, error, investment } = investmentDetails;

  const mouGenerated = useSelector((state) => state.mouGenerate);
  const { success } = mouGenerated;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(investmentListDetails(match.params.id));
    if (success) {
      window.alert(`MOU has been successfully generated`);
      dispatch({ type: MOU_CREATE_RESET });
      history.push('/');
    }
  }, [match, dispatch, history, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      investment.investmentVerified === false ||
      investment.invoicePrepared === false
    ) {
      window.alert('You cannot perform this action now');
    } else {
      if (isGenerated === false) {
        window.alert('Please generate mou');
      } else {
        dispatch(
          mouGenerate(
            investment._id,
            isGenerated,
            userInfo.data.user._id,
            moment().format(),
            note
          )
        );
      }
    }
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-balance-scale"></i> Generate MOU
      </h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {investment.investmentVerified === true &&
          investment.invoicePrepared === true &&
          investment.mouPrepared === false ? (
            <Form onSubmit={submitHandler}>
              <Card>
                <ListGroup>
                  <Card.Body>
                    <ListGroup.Item>
                      <h2>Client Details</h2>
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
                          type="text"
                          value={investment?.customer?.baraNumber}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="full-name">
                        <Form.Label>Client Full Name:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Full Name"
                          value={investment?.customer?.fullName}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="date-birth">
                        <Form.Label>Date of Birth:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Date of Birth"
                          value={moment(investment?.customer?.dob).format(
                            'Do MMMM YYYY'
                          )}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="address">
                        <Form.Label>Address:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="address"
                          value={investment?.customer?.address}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="date">
                        <Form.Label>Date of Confirmation:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="date"
                          value={moment(investment.dateInvestVerify).format(
                            'Do MMMM YYYY'
                          )}
                          disabled
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group controlId="confirmed-amout">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Amount"
                          value={investment.investmentAmount}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="gender">
                        <Form.Label>Gender:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Gender"
                          value={investment?.customer?.gender}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="plan">
                        <Form.Label>Investment Plan:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="plan"
                          value={`${investment?.investmentDuration} Months`}
                          disabled
                        ></Form.Control>
                      </Form.Group>
                    </ListGroup.Item>
                  </Card.Body>

                  <Card.Body>
                    <ListGroup.Item>
                      <h2>Generate MOU</h2>
                      <Form.Group controlId="is-confirmed">
                        <Form.Check
                          type="checkbox"
                          label="Generate MOU?"
                          checked={isGenerated}
                          onChange={(e) => setIsGenerated(e.target.checked)}
                        ></Form.Check>
                      </Form.Group>
                      <Form.Group controlId="Note-note">
                        <Form.Label>Note:</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Optional"
                          value={note}
                          rows={3}
                          onChange={(e) => setNote(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group controlId="generated-by">
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
                <i className="fas fa-balance-scale-right"></i> Generate MOU
              </Button>
            </Form>
          ) : (
            <Message variant="danger">
              You can't generate MOU at this time
            </Message>
          )}
        </>
      )}
    </FormContainer>
  );
};

export default LegalMOUScreen;

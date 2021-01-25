import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import moment from "moment";
import { topUpListDetails, topUpConfirm } from "../actions/topUpActions";

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const TopUpVerifyScreen = ({ match }) => {
  const [dateConfirm, setDateConfirm] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [note, setNote] = useState("");

  const dispatch = useDispatch();

  const topUpDetails = useSelector((state) => state.topUpDetails);
  const { loading, error, topup } = topUpDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(topUpListDetails(match.params.id));
  }, [match, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isConfirmed === true && dateConfirm !== "") {
      dispatch(
        topUpConfirm(
          topup._id,
          isConfirmed,
          dateConfirm,
          userInfo.data.user._id,
          note
        )
      );
    } else {
      window.alert("Not confirmed");
    }
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-check-double"></i> Confirm TopUp
      </h1>
      {loading ? (
        <Loader />
      ) : (
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
                      value={topup?.customer?.branch?.name}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="account-number">
                    <Form.Label>Bara Account Number:</Form.Label>
                    <Form.Control
                      type="select"
                      value={topup?.customer?.baraNumber}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="full-name">
                    <Form.Label>Contributor's Full Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={topup?.customer?.fullName}
                      disabled
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="bank-name">
                    <Form.Label>Bank Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={topup?.customer?.bankName}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="account-name">
                    <Form.Label>Account Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={topup?.customer?.accountName}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="account-number">
                    <Form.Label>Account Number:</Form.Label>
                    <Form.Control
                      type="text"
                      value={topup?.customer?.accountNumber}
                      disabled
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="type">
                    <Form.Label>Contribution Type:</Form.Label>
                    <Form.Control
                      type="text"
                      value={topup?.type}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </ListGroup.Item>
              </Card.Body>

              <Card.Body>
                <ListGroup.Item>
                  <h2>Confirmation</h2>
                  <Form.Group controlId="account-number">
                    <Form.Label>Official Bank:</Form.Label>
                    <Form.Control
                      type="text"
                      value={topup.officialBank}
                      disabled
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="confirmed-amout">
                    <Form.Label>Amount to Confirm:</Form.Label>
                    <Form.Control
                      type="text"
                      value={`N${topup?.topUpAmount
                        ?.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                      disabled
                    ></Form.Control>
                  </Form.Group>

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
      )}
    </FormContainer>
  );
};

export default TopUpVerifyScreen;

import React, { useState, useEffect } from "react";
import moment from "moment";
import { Form, Button, FormGroup, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { contributorListDetails } from "../actions/contributorActions";
import { listAllStaff } from "../actions/staffActions";
import { createInvestment } from "../actions/investmentActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { INVESTMENT_CREATE_RESET } from "../constants/investmentConstants";

// import CONTRIBUTOR_DETAILS_RESET from "../constants/contributorConstants";

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const ContributionNewScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const staffList = useSelector((state) => state.staffList);
  const { allStaff } = staffList;

  const contributorDetails = useSelector((state) => state.contributorDetails);
  const {
    contributor,
    loading: contributeLoading,
    error: contributeError,
  } = contributorDetails;

  const [dateConfirm, setDateConfirm] = useState("");
  const [investmentDuration, setInvestmentDuration] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [baraNumber, setBaraNumber] = useState("");
  const [officialBank, setOfficialBank] = useState("");
  const [note, setNote] = useState("");

  const investmentCreate = useSelector((state) => state.investmentCreate);
  const { loading, error, investment, success } = investmentCreate;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(contributorListDetails(match.params.id));
    dispatch(listAllStaff());
    if (success) {
      dispatch({ type: INVESTMENT_CREATE_RESET });
      window.alert(`${contributor.fullName} Created Successfully`);
      // dispatch({ type: CONTRIBUTOR_DETAILS_RESET });
      history.push(`/contribution/new-contributor`);
    }
  }, [dispatch, match, history, investment, contributor.fullName, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    const paymentDates = [];
    for (let i = 1; i <= investmentDuration; i += 1) {
      paymentDates.push(
        moment(dateConfirm).add(i, "months").format("YYYY-MM-DD")
      );
    }

    // const implementDate = moment("2021-01-01").format("YYYY-MM-DD");
    // if (moment(dateConfirm).format("YYYY-MM-DD") >= implementDate) {
    //   if (investmentDuration === 6) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 10;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 5;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 2;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 1;
    //     }
    //   } else if (investmentDuration === 12) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 12;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 7;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 4;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 2;
    //     }
    //   } else if (investmentDuration === 24) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 15;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 10;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 5;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 3;
    //     }
    //   }
    // } else {
    //   if (investmentDuration === 6) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 15;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 10;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 5;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 3;
    //     }
    //   } else if (investmentDuration === 12) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 17;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 12;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 7;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 5;
    //     }
    //   } else if (investmentDuration === 24) {
    //     if (investmentAmount <= 5000000) {
    //       percent = 20;
    //     }
    //     if (investmentAmount >= 5000001 && investmentAmount <= 50000000) {
    //       percent = 15;
    //     }
    //     if (investmentAmount >= 50000001 && investmentAmount <= 100000000) {
    //       percent = 10;
    //     }
    //     if (investmentAmount >= 100000001) {
    //       percent = 5;
    //     }
    //   }
    // }

    // const data = new FormData();
    // data.append("customer", contributor._id);
    // data.append("dateInvestVerify", dateConfirm);
    // data.append("investmentAmount", investmentAmount);
    // data.append("investmentDuration", investmentDuration);
    // data.append("paymentDates", paymentDates);
    // data.append("paymentProof", proofPayment);
    // data.append("createdBy", userInfo.data.user._id);
    dispatch(
      createInvestment(
        contributor._id,
        dateConfirm,
        officialBank,
        note,
        investmentAmount,
        investmentDuration,
        paymentDates,
        userInfo.data.user._id
      )
    );
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-credit-card"></i> NEW CONTRIBUTION
      </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

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
                    value={contributor?.branch?.name}
                    disabled
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="full-name">
                  <Form.Label>Full Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={contributor.fullName}
                    disabled
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="bank-name">
                  <Form.Label>Bank Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={contributor.bankName}
                    disabled
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="account-name">
                  <Form.Label>Account Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Account Name"
                    value={contributor.accountName}
                    disabled
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="account-number">
                  <Form.Label>Enter Account Number:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter correct Account Number"
                    value={contributor.accountNumber}
                    disabled
                  ></Form.Control>
                </Form.Group>
              </ListGroup.Item>
            </Card.Body>

            <Card.Body>
              <ListGroup.Item>
                <h2>New Contribution</h2>
                <Form.Group controlId="contribution-amout">
                  <Form.Label>Contribution Amount:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Amount Contributed"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="contribution-duration">
                  <Form.Label>Contribution Duration:</Form.Label>
                  <Form.Control
                    as="select"
                    value={investmentDuration}
                    onChange={(e) => setInvestmentDuration(e.target.value)}
                  >
                    <option>Select Contribution Duration</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="bank-name">
                  <Form.Label>Bank Name:</Form.Label>
                  <Form.Control
                    as="select"
                    value={officialBank}
                    onChange={(e) => setOfficialBank(e.target.value)}
                  >
                    <option value="">Select Bank</option>
                    <option value="Fidelity Bank Plc">Fidelity Bank Plc</option>
                    <option value="Keystone Bank Limited">
                      Keystone Bank Limited
                    </option>
                    <option value="Polaris Bank Limited">
                      Polaris Bank Limited.
                    </option>
                    <option value="Sterling Bank Plc">Sterling Bank Plc</option>
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
                    placeholder="Required"
                    value={note}
                    rows={3}
                    onChange={(e) => setNote(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="created-by">
                  <Form.Label>Created By:</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={`${userInfo.data.user.firstName} ${
                      userInfo.data.user.lastName
                    } ${userInfo.data.user.otherName || ""}`}
                  ></Form.Control>
                </Form.Group>
              </ListGroup.Item>
            </Card.Body>
          </ListGroup>
        </Card>

        <Button type="submit" variant="primary" block>
          Create Contribution
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ContributionNewScreen;

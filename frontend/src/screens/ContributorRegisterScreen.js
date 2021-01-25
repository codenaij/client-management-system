import React, { useState, useEffect } from "react";
import { Form, Button, FormGroup, ListGroup, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listBranches } from "../actions/branchActions";
import { createContributor } from "../actions/contributorActions";
import {
  CONTRIBUTOR_CREATE_RESET,
  CONTRIBUTOR_DETAILS_RESET,
} from "../constants/contributorConstants";
import { INVESTMENT_CREATE_RESET } from "../constants/investmentConstants";

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const ContributorRegisterScreen = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [busStop, setBusStop] = useState("");
  const [city, setCity] = useState("");
  const [stateResidence, setStateResidence] = useState("");
  const [nationality, setNationality] = useState("");
  const [stateOrigin, setStateOrigin] = useState("");
  const [lga, setLga] = useState("");
  const [company, setCompany] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [meansIdentification, setMeansIdentification] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinPhone, setKinPhone] = useState("");
  const [kinAddress, setKinAddress] = useState("");
  const [branch, setBranch] = useState("");
  const [dob, setDob] = useState("");
  const [minor, setMinor] = useState(false);
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountOfficer, setAccountOfficer] = useState("");

  const [createdBy, setCreatedBy] = useState(
    `${userInfo.data.user.firstName} ${userInfo.data.user.lastName} ${
      userInfo.data.user.otherName || ""
    }`
  );

  const dispatch = useDispatch();

  const branchList = useSelector((state) => state.branchList);
  const { branches } = branchList;

  const staffList = useSelector((state) => state.staffList);
  const { staffs } = staffList;

  const contributorCreate = useSelector((state) => state.contributorCreate);
  const { loading, error, contributor, success } = contributorCreate;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: INVESTMENT_CREATE_RESET });
    // dispatch({ type: CONTRIBUTOR_DETAILS_RESET });
    dispatch(listBranches());
    if (success) {
      history.push(`/contribution/new-contribution/${contributor._id}`);
      dispatch({ type: CONTRIBUTOR_CREATE_RESET });
    }
  }, [dispatch, history, contributor._id, success]);
  // if (contributor === {}) {
  //   history.push(`/contribution/new-contribution/${contributor._id}`);
  //   dispatch({ type: CONTRIBUTOR_CREATE_RESET });
  // }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createContributor(
        userInfo.data.user.branch._id,
        fullName,
        minor,
        company,
        maritalStatus,
        gender,
        phone,
        email,
        dob,
        occupation,
        organisation,
        meansIdentification,
        address,
        busStop,
        city,
        stateResidence,
        nationality,
        stateOrigin,
        lga,
        kinName,
        kinPhone,
        kinAddress,
        bankName,
        accountName,
        accountNumber,
        createdBy
      )
    );
  };

  return (
    <FormContainer>
      <h1>
        <i className="fas fa-users"></i> NEW CONTRIBUTOR
      </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Card>
          <ListGroup>
            <Card.Body>
              <ListGroup.Item>
                <h2>Basic Information</h2>
                <Form.Group controlId="branch">
                  <Form.Label>Branch Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={userInfo?.data?.user?.branch?.name}
                    disabled
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Label>Name of Contributor:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <FormGroup>
                  <Form.Check
                    label="Minor"
                    type="checkbox"
                    checked={minor}
                    onChange={(e) => setMinor(e.target.checked)}
                  />
                </FormGroup>

                <FormGroup>
                  <Form.Check
                    label="Company"
                    type="checkbox"
                    checked={company}
                    onChange={(e) => setCompany(e.target.checked)}
                  />
                </FormGroup>

                <Form.Group controlId="phone">
                  <Form.Label>Phone:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Valid Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </ListGroup.Item>
            </Card.Body>

            <Card.Body>
              <ListGroup.Item>
                <h2>Bank Details</h2>
                <Form.Group controlId="bank-name">
                  <Form.Label>Bank Name:</Form.Label>
                  <Form.Control
                    as="select"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  >
                    <option value="">Select Bank</option>
                    <option value="Access Bank Plc">Access Bank Plc</option>
                    <option value="Citibank Nigeria Limited">
                      Citibank Nigeria Limited
                    </option>
                    <option value="Coronation Merchant Bank">
                      Coronation Merchant Bank
                    </option>
                    <option value="Ecobank Nigeria Plc">
                      Ecobank Nigeria Plc
                    </option>
                    <option value="FBNQuest Merchant Bank">
                      FBNQuest Merchant Bank
                    </option>
                    <option value="Fidelity Bank Plc">Fidelity Bank Plc</option>
                    <option value="Finca Microfinance Bank Limited">
                      Finca Microfinance Bank Limited
                    </option>
                    <option value="First Bank of Nigeria Limited">
                      First Bank of Nigeria Limited
                    </option>
                    <option value="First City Monument Bank Limited">
                      First City Monument Bank Limited
                    </option>
                    <option value="FSDH Merchant Bank">
                      FSDH Merchant Bank
                    </option>
                    <option value="Globus Bank Limited">
                      Globus Bank Limited
                    </option>
                    <option value="Guaranty Trust Bank Plc">
                      Guaranty Trust Bank Plc
                    </option>
                    <option value="Heritage Banking Company Limited">
                      Heritage Banking Company Limited
                    </option>
                    <option value="Jaiz Bank Plc">Jaiz Bank Plc</option>
                    <option value="Keystone Bank Limited">
                      Keystone Bank Limited
                    </option>
                    <option value="Mutual Trust Microfinance Bank">
                      Mutual Trust Microfinance Bank
                    </option>
                    <option value="Nova Merchant Bank">
                      Nova Merchant Bank
                    </option>
                    <option value="Polaris Bank Limited">
                      Polaris Bank Limited.
                    </option>
                    <option value="Providus Bank Limited">
                      Providus Bank Limited
                    </option>
                    <option value="Rand Merchant Bank">
                      Rand Merchant Bank
                    </option>
                    <option value="Stanbic IBTC Bank Plc">
                      Stanbic IBTC Bank Plc
                    </option>
                    <option value="Standard Chartered">
                      Standard Chartered
                    </option>
                    <option value="Sterling Bank Plc">Sterling Bank Plc</option>
                    <option value="SunTrust Bank Nigeria Limited">
                      SunTrust Bank Nigeria Limited
                    </option>
                    <option value="TAJBank Limited">TAJBank Limited</option>
                    <option value="Titan Trust Bank Limited">
                      Titan Trust Bank Limited
                    </option>
                    <option value="Union Bank of Nigeria Plc">
                      Union Bank of Nigeria Plc
                    </option>
                    <option value="United Bank for Africa Plc">
                      United Bank for Africa Plc
                    </option>
                    <option value="Unity Bank Plc">Unity Bank Plc</option>
                    <option value="Wema Bank Plc">Wema Bank Plc</option>
                    <option value="Zenith Bank Plc">Zenith Bank Plc</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="account-name">
                  <Form.Label>Account Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Account Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="account-number">
                  <Form.Label>Enter Account Number:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter correct Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </ListGroup.Item>
            </Card.Body>

            <Button type="submit" variant="primary" block>
              Register New Contributor
            </Button>
          </ListGroup>
        </Card>
      </Form>
    </FormContainer>
  );
};

export default ContributorRegisterScreen;

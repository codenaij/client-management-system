import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listBranches } from "../actions/branchActions";
import { registerStaff } from "../actions/staffActions";
import { STAFF_REGISTER_RESET } from "../constants/staffConstants";

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const StaffRegisterScreen = ({ history }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const staffRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo: staffInfo } = staffRegister;

  const branchList = useSelector((state) => state.branchList);
  const { branches } = branchList;

  useEffect(() => {
    if (listBranches) {
      dispatch(listBranches());
    }
    if (staffInfo) {
      dispatch({ type: STAFF_REGISTER_RESET });
      history.push("/all-staff");
    }
  }, [dispatch, history, staffInfo]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      registerStaff(
        firstName,
        lastName,
        otherName,
        email,
        password,
        passwordConfirm,
        role,
        branch
      )
    );
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-user-tie"></i> CREATE STAFF
      </h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="first-name">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Surname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="last-name">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="other-name">
          <Form.Label>Other Names:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Any Other Name"
            value={otherName}
            onChange={(e) => setOtherName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="branch">
          <Form.Label>Branch:</Form.Label>
          <Form.Control
            as="select"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option>Choose Branch</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="role">
          <Form.Label>Designation:</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Select Designation</option>
            <option value="accounts">accounts</option>
            <option value="admin">admin</option>
            <option value="business-manager">business-manager</option>
            <option value="compliance">compliance</option>
            <option value="documentation">documentation</option>
            <option value="hr">hr</option>
            <option value="ict">ict</option>
            <option value="investment">investment</option>
            <option value="lead-accounts">lead-accounts</option>
            <option value="legal">legal</option>
            <option value="managing-director">managing-director</option>
            <option value="president">president</option>
            <option value="regional-manager">regional-manager</option>
            <option value="special-duties">special-duties</option>
            <option value="staff">staff</option>
            <option value="super-admin">super-admin</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Valid Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password (>= 8 values)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirm-password">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password Again"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" block>
          Create Staff
        </Button>
      </Form>
    </FormContainer>
  );
};

export default StaffRegisterScreen;

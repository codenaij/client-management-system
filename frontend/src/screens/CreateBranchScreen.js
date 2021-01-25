import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createBranch } from "../actions/branchActions";
import { BRANCH_CREATE_RESET } from "../constants/branchConstants";

// TODO: REDIRECT
// TODO: CLEAR INPUT USING RESET
const CreateBranchScreen = ({ history, location }) => {
  const [branchName, setBranchName] = useState("");
  const [coopName, setCoopName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [region, setRegion] = useState("");

  const dispatch = useDispatch();

  const branchCreate = useSelector((state) => state.branchCreate);
  const { loading, error, branch } = branchCreate;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (branch) {
      dispatch({ type: BRANCH_CREATE_RESET });
      history.push("/branches");
    }
  }, [dispatch, history, branch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createBranch(branchName, coopName, branchCode, branchAddress, region)
    );
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-city"></i> Create Branch
      </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      {branch && (
        <Message variant="success">Branch Created Successfully</Message>
      )}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="branchName">
          <Form.Label>Branch Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Branch Name"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="coop">
          <Form.Label>Cooperative Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Cooperative Name"
            value={coopName}
            onChange={(e) => setCoopName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="branchAddress">
          <Form.Label>Branch Address:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Branch Address"
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="region">
          <Form.Label>Region:</Form.Label>
          <Form.Control
            as="select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option>Choose Region</option>
            <option value="Mid-West">Mid-West</option>
            <option value="North">North</option>
            <option value="South-South">South-South</option>
            <option value="South-West">South-West</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="branchCode">
          <Form.Label>Branch Code:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Branch Code"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" block>
          Create Branch
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateBranchScreen;

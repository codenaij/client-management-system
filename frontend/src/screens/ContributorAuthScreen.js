import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listBranches } from '../actions/branchActions';
import { registerContributor } from '../actions/authActions';

// TODO: GET BRANCH FROM BRANCH MODEL AND LOOP IN BRANCH
const ContributorAuthScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');

  const dispatch = useDispatch();

  const contributorRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = contributorRegister;

  const branchList = useSelector((state) => state.branchList);
  const { branches } = branchList;

  useEffect(() => {
    dispatch(listBranches());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      registerContributor(firstName, lastName, otherName, email, branch)
    );
  };
  return (
    <FormContainer>
      <h1>
        <i className="fas fa-user-tie"></i> REGISTER CONTRIBUTOR
      </h1>
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

        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Valid Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" block>
          REGISTER CONTRIBUTOR
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ContributorAuthScreen;

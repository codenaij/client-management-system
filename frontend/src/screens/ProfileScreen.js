import React, { useEffect, useState } from "react";
import moment from "moment";
import { Card, ListGroup, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { listAllInvestments } from "../actions/investmentActions";
import { updateMyPassword } from "../actions/authActions";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const investmentList = useSelector((state) => state.investmentList);
  const { loading, error, allInvestments } = investmentList;

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const client = allInvestments?.filter(
    (investment) =>
      investment?.investmentOfficer?._id === userInfo.data.user?._id
  );

  useEffect(() => {
    dispatch(listAllInvestments());
  }, [dispatch]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateMyPassword(oldPassword, newPassword, newPasswordConfirm));
  };

  return (
    <>
      <h1>My Profile</h1>
      <>
        <Card>
          <ListGroup>
            <Card.Body>
              <FormContainer>
                <h4>Update Password</h4>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="old-password">
                    <Form.Label>Old Password:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="new-password">
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="confirm-new-password">
                    <Form.Label>Confirm New Password:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter New Password Again"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary" block>
                    Update My Password
                  </Button>
                </Form>
              </FormContainer>
            </Card.Body>
          </ListGroup>
        </Card>
      </>
    </>
  );
};

export default ProfileScreen;

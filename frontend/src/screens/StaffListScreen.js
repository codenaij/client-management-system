import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listAllStaff } from "../actions/staffActions";

const StaffListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const staffList = useSelector((state) => state.staffList);
  const { loading, error, allStaff } = staffList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !(userInfo.data.user.role === "super-admin")) {
      history.push("/login");
    }
    dispatch(listAllStaff());
  }, [dispatch, history, userInfo]);

  const createStaffHandler = () => {
    history.push("/register-staff");
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Staff</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createStaffHandler}>
            <i className="fas fa-plus"></i> Create New Staff
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>First</th>
                <th>Last</th>
                <th>Other</th>
                <th>Region</th>
                <th>Branch</th>
                <th>role</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {allStaff.map((staff) => (
                <tr key={staff._id}>
                  <td></td>
                  <td>{staff.firstName}</td>
                  <td>{staff.lastName}</td>
                  <td>{staff.otherName}</td>
                  <td>{staff.branch.region}</td>
                  <td>{staff.branch.name}</td>
                  <td>{staff.role.toUpperCase()}</td>
                  <td>
                    <Link to={`/staff/${staff._id}`}>
                      <i className="fas fa-info-circle"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default StaffListScreen;

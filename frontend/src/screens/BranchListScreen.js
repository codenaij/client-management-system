import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listBranches } from "../actions/branchActions";

const BranchListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const branchList = useSelector((state) => state.branchList);
  const { loading, error, branches } = branchList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !(userInfo.data.user.role === "super-admin")) {
      history.push("/login");
    }
    dispatch(listBranches());
  }, [dispatch, history, userInfo]);

  const createBranchHandler = () => {
    history.push("/create-branch");
  };

  const deleteHandler = () => {
    console.log("Delete");
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Branches</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createBranchHandler}>
            <i className="fas fa-plus"></i> Create New Branch
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
                <th>CODE</th>
                <th>NAME</th>
                <th>COOPERATIVE NAME</th>
                <th>ADDRESS</th>
                <th>REGION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch.code}</td>
                  <td>{branch.name}</td>
                  <td>{branch.coopName}</td>
                  <td>{branch.address}</td>
                  <td>{branch.region}</td>
                  <td>
                    <LinkContainer to={`/branch/${branch._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(branch._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
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

export default BranchListScreen;

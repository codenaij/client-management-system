import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col, Form, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listAllContributorsSearch } from "../actions/contributorActions";

const ContributorListScreen = ({ history }) => {
  const [formSearch, setFormSearch] = "";
  const dispatch = useDispatch();

  const contributorList = useSelector((state) => state.contributorList);
  const { loading, error, allContributors } = contributorList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // if (!userInfo || !(userInfo.data.user.role === 'super-admin')) {
    //   history.push('/login');
    // }
    dispatch(listAllContributorsSearch());
  }, [dispatch, history, userInfo, formSearch]);

  const createContributorHandler = () => {
    history.push("/contribution/new-contributor");
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>CONTRIBUTORS</h1>
        </Col>
      </Row>

      <Form block>
        <FormControl
          type="text"
          placeholder="Search"
          value={formSearch}
          onChange={setFormSearch}
        />
        <Button className="btn btn-dark my-3">Search</Button>
      </Form>

      <Row className="align-items-center">
        <Col></Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createContributorHandler}>
            <i className="fas fa-plus"></i> Create New Contributor
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
                <th>
                  Full Name <i className="fas fa-sort"></i>
                </th>
                <th>Branch</th>
                <th>Gender</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {allContributors
                .filter(
                  (contributor) =>
                    contributor.branch?.name ===
                    userInfo.data.user?.branch?.name
                )
                .map((contributor) => (
                  <tr key={contributor._id}>
                    <td></td>
                    <td>{contributor.fullName}</td>
                    <td>{contributor.branch.name}</td>
                    <td>{contributor.gender}</td>
                    <td>
                      <Link to={`/contributor/${contributor._id}`}>
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

export default ContributorListScreen;

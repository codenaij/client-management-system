import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  Card,
  ListGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listAllInvestmentsDue } from "../actions/investmentActions";

const BMSummaryScreen = ({ history }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const investmentList = useSelector((state) => state.investmentList);
  const { loading, error, allInvestments } = investmentList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const investmentSummary = allInvestments?.filter(
    (investment) =>
      investment?.customer?.branch?.name === userInfo.data.user?.branch?.name
  );

  useEffect(() => {
    if (startDate) {
      dispatch(listAllInvestmentsDue(startDate));
      dispatch(listAllInvestmentsDue(endDate));
    }
  }, [dispatch, history, userInfo, startDate, endDate]);

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    if (startDate) {
      history.push(`/investment-list?date=${startDate}`);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Generate Summary</h1>
        </Col>
      </Row>

      <Form onSubmit={searchSubmitHandler}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="start">
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="end">
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button type="submit" block className="btn btn-dark">
              <i className="fas fa-search"></i> Search
            </Button>
          </Col>
        </Row>
      </Form>

      <>
        <>
          <Card>
            <ListGroup>
              {/*TO CHECK THAT ROLE IS ASSIGNED TO ONLY SPECIAL DUTIES */}
              {(userInfo.data.user.role === "business-manager" ||
                userInfo.data.user.role === "super-admin") && (
                <>
                  <Card.Body>
                    <h2>Contribution Summary</h2>
                    <ListGroup.Item>
                      {loading ? (
                        <Loader />
                      ) : error ? (
                        <Message variant="danger">{error}</Message>
                      ) : (
                        <Table
                          striped
                          bordered
                          hover
                          responsive
                          className="table-sm"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>
                                Full Name{" "}
                                <Button className="btn btn-light">
                                  <i className="fas fa-sort"></i>
                                </Button>
                              </th>
                              <th>
                                Date of Application{" "}
                                <Button className="btn btn-light">
                                  <i className="fas fa-sort"></i>
                                </Button>
                              </th>
                              <th>Amount</th>
                              <th>Investment Officer </th>
                              <th>Confirmed?</th>
                              <th>Type </th>
                              <th>More</th>
                            </tr>
                          </thead>
                          <tbody>
                            {investmentSummary.length === 0 ? (
                              <tr>
                                <td></td>
                                <td colSpan="7">
                                  No Contribution Summary available for date.
                                  Please Change Date{" "}
                                </td>
                              </tr>
                            ) : (
                              investmentSummary?.map((invest) => (
                                <tr key={invest._id}>
                                  <td></td>
                                  <td>{invest.customer?.fullName}</td>
                                  <td>
                                    {moment(invest.createdAt).format(
                                      "Do MMMM YYYY"
                                    )}
                                  </td>
                                  <td>
                                    N{numberComma(invest.investmentAmount)}
                                  </td>
                                  <td>{`${
                                    invest.investmentOfficer?.firstName
                                  } ${invest.investmentOfficer?.lastName} ${
                                    invest.investmentOfficer?.otherName || ""
                                  }`}</td>
                                  <td>{invest.officialBank}</td>
                                  <td>{invest.type}</td>
                                  <td>
                                    {userInfo.data.user.role ===
                                      "special-duties" ||
                                    userInfo.data.user.role ===
                                      "super-admin" ? (
                                      <Link
                                        to={`/contribution/confirm-contribution/${invest?._id}`}
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </Link>
                                    ) : (
                                      "Not Authorised"
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      )}
                    </ListGroup.Item>
                  </Card.Body>

                  <Card.Body>
                    <h2>TopUp Summary</h2>
                    <ListGroup.Item>
                      {loading ? (
                        <Loader />
                      ) : error ? (
                        <Message variant="danger">{error}</Message>
                      ) : (
                        <Table
                          striped
                          bordered
                          hover
                          responsive
                          className="table-sm"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>
                                Full Name{" "}
                                <Button className="btn btn-light">
                                  <i className="fas fa-sort"></i>
                                </Button>
                              </th>
                              <th>
                                Date of Application{" "}
                                <Button className="btn btn-light">
                                  <i className="fas fa-sort"></i>
                                </Button>
                              </th>
                              <th>Amount</th>
                              <th>Investment Officer </th>
                              <th>Confirmed?</th>
                              <th>Type </th>
                              <th>More</th>
                            </tr>
                          </thead>
                          <tbody>
                            {investmentSummary.length === 0 ? (
                              <tr>
                                <td></td>
                                <td colSpan="7">
                                  No TopUp Summary available for date. Please
                                  Change Date{" "}
                                </td>
                              </tr>
                            ) : (
                              investmentSummary?.map((invest) => (
                                <tr key={invest._id}>
                                  <td></td>
                                  <td>{invest.customer?.fullName}</td>
                                  <td>
                                    {moment(invest.createdAt).format(
                                      "Do MMMM YYYY"
                                    )}
                                  </td>
                                  <td>
                                    N{numberComma(invest.investmentAmount)}
                                  </td>
                                  <td>{`${
                                    invest.investmentOfficer?.firstName
                                  } ${invest.investmentOfficer?.lastName} ${
                                    invest.investmentOfficer?.otherName || ""
                                  }`}</td>
                                  <td>{invest.officialBank}</td>
                                  <td>{invest.type}</td>
                                  <td>
                                    {userInfo.data.user.role ===
                                      "special-duties" ||
                                    userInfo.data.user.role ===
                                      "super-admin" ? (
                                      <Link
                                        to={`/contribution/confirm-contribution/${invest?._id}`}
                                      >
                                        <i className="fas fa-info-circle"></i>
                                      </Link>
                                    ) : (
                                      "Not Authorised"
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      )}
                    </ListGroup.Item>
                  </Card.Body>
                </>
              )}
            </ListGroup>
          </Card>
        </>
      </>
    </>
  );
};

export default BMSummaryScreen;

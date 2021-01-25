import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// import tableToCsv from 'node-table-to-csv';
import { listAllInvestmentsDue } from "../actions/investmentActions";

const DuePaymentScreen = ({ history }) => {
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const investmentList = useSelector((state) => state.investmentList);
  const { loading, error, allInvestments } = investmentList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (date) {
      dispatch(listAllInvestmentsDue(date));
    }
  }, [dispatch, history, userInfo, date]);

  const dateSubmitHandler = (e) => {
    e.preventDefault();

    if (date) {
      history.push(`/investment-list?date=${date}`);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Generate Daily ROI</h1>
        </Col>
      </Row>

      <Form onSubmit={dateSubmitHandler}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="date">
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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

      <Row className="align-items-center">
        <Col></Col>
        <Col className="text-right"></Col>
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
                  Full Name{" "}
                  {/*<Button className="btn btn-light">
                    <i className="fas fa-sort"></i>
                  </Button>*/}
                </th>
                <th>Branch</th>
                <th>Total Capital</th>
                <th>ROI</th>
                <th>Duration</th>
                <th>Investment Date</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {/*.filter(
              (investment) => investment?.customer?.branch?.name === 'Abuja'
            )*/}
              {allInvestments.map((investment) => (
                <tr key={investment._id}>
                  <td></td>
                  <td>{investment?.customer?.fullName}</td>
                  <td>{investment?.customer?.branch?.name}</td>
                  <td>{`N${numberComma(investment.totalAmountInvested)}`}</td>
                  <td>{`N${numberComma(investment.roi)}`}</td>
                  <td>{`${investment.investmentDuration} months`}</td>
                  <td>
                    {moment(investment.dateInvestVerify).format("Do MMMM YYYY")}
                  </td>
                  <td>
                    <Link to={`/contributor/${investment?.customer._id}`}>
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

export default DuePaymentScreen;

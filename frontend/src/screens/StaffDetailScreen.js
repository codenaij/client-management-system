import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, ListGroup, Card, Image, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listStaffDetails } from '../actions/staffActions';

const StaffDetailScreen = ({ match }) => {
  const dispatch = useDispatch();

  const staffDetails = useSelector((state) => state.staffDetails);
  const { loading, error, staff } = staffDetails;

  useEffect(() => {
    dispatch(listStaffDetails(match.params.id));
  }, [dispatch, match]);
  return (
    <>
      <Link className="btn btn-dark my-3" to="/all-staff">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="my-3">
            <Col className="text-center" md={12}>
              <h1>{`${staff.firstName} ${staff.lastName} ${
                staff.otherName || ''
              }`}</h1>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <p>
                <span className="profile-text">Name:</span>{' '}
                {`${staff.firstName} ${staff.lastName} ${
                  staff.otherName || ''
                }`}
              </p>
            </Col>

            <Col md={4}>
              <p>
                <span className="profile-text">DESIGNATION:</span> {staff.role}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <span className="profile-text">Email:</span> {staff.email}
              </p>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default StaffDetailScreen;

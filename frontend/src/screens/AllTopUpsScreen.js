import { moment } from 'moment';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Card, Image, Button } from 'react-bootstrap';
import { investmentListDetails } from '../actions/investmentActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ContributorDetailsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const investmentDetails = useSelector((state) => state.investmentDetails);
  const {
    loading: investmentLoading,
    error: investmentError,
    investment,
  } = investmentDetails;
  useEffect(() => {
    dispatch(investmentListDetails(match.params.id));
  }, [dispatch, match]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/all-contributors">
        Go Back
      </Link>
      {investmentLoading ? (
        <Loader />
      ) : (
        <>
          <Card>
            <ListGroup>
              <h2 className="text-center">All TopUps</h2>

              {investment.topups?.length > 0 &&
                investment.topups !== undefined &&
                investment.topups.map((topup) => (
                  <Card.Body>
                    <ListGroup.Item>
                      <div key={topup._id}>
                        <Row>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                TopUp Amount:
                              </span>{' '}
                              {`N${numberComma(topup.topUpAmount)}`}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                TopUp Verified:
                              </span>{' '}
                              {topup.topUpVerified ? (
                                <span>True</span>
                              ) : (
                                <span>False</span>
                              )}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                TopUp Verified Date:
                              </span>{' '}
                              {topup.dateTopUpVerify || ''}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}></Col>
                          <Col md={4}></Col>
                          <Col md={4}>
                            <p>
                              {topup.topUpVerified ? (
                                <LinkContainer
                                  to={`/topup/verify-contribution/${topup._id}`}
                                >
                                  <Button block disabled>
                                    Verify TopUp
                                  </Button>
                                </LinkContainer>
                              ) : (
                                <LinkContainer
                                  to={`/topup/verify-contribution/${topup._id}`}
                                >
                                  <Button block>Verify TopUp</Button>
                                </LinkContainer>
                              )}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </ListGroup.Item>
                  </Card.Body>
                ))}
            </ListGroup>
          </Card>
        </>
      )}
    </>
  );
};

export default ContributorDetailsScreen;

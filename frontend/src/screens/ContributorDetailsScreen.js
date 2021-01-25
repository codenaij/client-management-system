import { moment } from "moment";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Card, Image, Button } from "react-bootstrap";
import { contributorListDetails } from "../actions/contributorActions";
import { investmentListDetails } from "../actions/investmentActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { CONTRIBUTOR_DETAILS_RESET } from "../constants/contributorConstants";

const ContributorDetailsScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const contributorDetails = useSelector((state) => state.contributorDetails);
  const { loading, error, contributor } = contributorDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // const investmentDetails = useSelector((state) => state.investmentDetails);
  // const {
  //   loading: investmentLoading,
  //   error: investmentError,
  //   investment,
  // } = investmentDetails;

  useEffect(() => {
    dispatch(contributorListDetails(match.params.id));
    // dispatch(investmentListDetails());
  }, [dispatch, match]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/all-contributors">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Row className="my-3">
            <Col className="text-center" md={12}>
              <h1>
                {contributor?.fullName} | {contributor?.baraNumber}
              </h1>
            </Col>
          </Row>
          <Card>
            <ListGroup>
              <Card.Body>
                <ListGroup.Item>
                  <h2>Basic Information</h2>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Name:</span>{" "}
                        {contributor?.fullName}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Minor:</span>{" "}
                        {contributor?.minor ? (
                          <span>True</span>
                        ) : (
                          <span>False</span>
                        )}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Branch:</span>{" "}
                        {contributor?.branch?.name}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Email:</span>{" "}
                        {contributor?.email}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Marital Status:</span>{" "}
                        {contributor?.maritalStatus}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Phone:</span>{" "}
                        {`0${contributor?.phone}`}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Gender:</span>{" "}
                        {contributor?.gender}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Date of Birth:</span>{" "}
                        {contributor?.dob?.substring(0, 10)}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">
                          Means of Identification:
                        </span>{" "}
                        {contributor?.meansIdentification}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Occupation:</span>{" "}
                        {contributor?.occupation}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Organization:</span>{" "}
                        {contributor?.organisation}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Nationality:</span>{" "}
                        {contributor?.nationality}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Address:</span>{" "}
                        {contributor?.address}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Nearest Busstop:</span>{" "}
                        {contributor?.busStop}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">City:</span>{" "}
                        {contributor?.city}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">
                          State of Residence:
                        </span>{" "}
                        {contributor?.stateResidence}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">
                          Local Government Area:
                        </span>{" "}
                        {contributor?.lga}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">State of Origin:</span>{" "}
                        {contributor?.stateOrigin}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Card.Body>
              <Card.Body>
                <ListGroup.Item>
                  <h2>Next of Kin Details</h2>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Next of Kin Name:</span>{" "}
                        {contributor?.kinName}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Next of Kin Phone:</span>{" "}
                        {contributor?.kinPhone}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">
                          Next of Kin Address:
                        </span>{" "}
                        {contributor?.kinAddress}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Card.Body>
              <Card.Body>
                <ListGroup.Item>
                  <h2>Bank Details</h2>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Bank Name:</span>{" "}
                        {contributor?.bankName}
                      </p>
                    </Col>

                    <Col md={4}>
                      <p>
                        <span className="profile-text">Account Name:</span>{" "}
                        {contributor?.accountName}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span className="profile-text">Account Number:</span>{" "}
                        {contributor?.accountNumber}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </Card.Body>
              {contributor?.investments?.length === 0 && (
                <Card.Body>
                  <ListGroup.Item>
                    <Row>
                      <Col md={4}></Col>

                      <Col md={4}></Col>

                      <Col md={4}>
                        <LinkContainer
                          to={`/contribution/new-contribution/${contributor._id}`}
                        >
                          <Button block>New Contribution</Button>
                        </LinkContainer>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </Card.Body>
              )}
              {contributor?.investments?.length > 0 &&
                contributor?.investments !== undefined && (
                  <>
                    <Card.Body>
                      <ListGroup.Item>
                        <h2>Contribution Details</h2>
                        <Row>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Amount:
                              </span>{" "}
                              {`N${contributor?.investments[0].investmentAmount
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Duration:
                              </span>{" "}
                              {`${contributor?.investments[0].investmentDuration} Months`}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Officer:
                              </span>{" "}
                              {`${
                                contributor?.investments[0].investmentOfficer
                                  ?.firstName || ""
                              } ${
                                contributor?.investments[0].investmentOfficer
                                  ?.lastName || ""
                              } ${
                                contributor?.investments[0].investmentOfficer
                                  ?.otherName || ""
                              } (${
                                contributor?.investments[0].investmentOfficer
                                  ?.branch?.name || ""
                              })`}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Verified:
                              </span>{" "}
                              {contributor.investments[0].investmentVerified ? (
                                <span>True</span>
                              ) : (
                                <span>False</span>
                              )}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Date:
                              </span>{" "}
                              {contributor?.investments[0].dateInvestVerify?.substring(
                                0,
                                10
                              ) || "Not Verified"}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Contribution Percentage:
                              </span>{" "}
                              {contributor?.investments[0].dateInvestVerify?.substring(
                                0,
                                10
                              ) || "Not Verified"}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}></Col>
                          <Col md={4}></Col>
                          <Col md={4}>
                            {userInfo.data.user.role === "special-duties" && (
                              <p>
                                {contributor.investments[0]
                                  .investmentVerified ? (
                                  <LinkContainer
                                    to={`/contribution/confirm-contribution/${contributor._id}`}
                                  >
                                    <Button block disabled>
                                      Verify Contribution
                                    </Button>
                                  </LinkContainer>
                                ) : (
                                  <LinkContainer
                                    to={`/contribution/confirm-contribution/${contributor.investments[0]._id}`}
                                  >
                                    <Button block>Verify Contribution</Button>
                                  </LinkContainer>
                                )}
                              </p>
                            )}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </Card.Body>
                    <Card.Body>
                      <ListGroup.Item>
                        <h2>Contribution Summary</h2>
                        <Row>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                Total Contribution:
                              </span>{" "}
                              {`N${contributor?.investments[0].totalAmountInvested
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text">
                                ROI(Confirmed):
                              </span>{" "}
                              {`N${contributor?.investments[0].roi
                                ?.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                            </p>
                          </Col>
                          <Col md={4}>
                            <p>
                              <span className="profile-text"></span>
                            </p>
                          </Col>
                        </Row>
                        <ListGroup.Item>
                          <h4>ROI DATES</h4>
                          <Row>
                            {contributor?.investments[0]?.paymentDates.map(
                              (date) => (
                                <p key={date}> {date?.substring(0, 10)} | </p>
                              )
                            )}
                          </Row>
                        </ListGroup.Item>
                      </ListGroup.Item>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup.Item>
                        <Row>
                          <Col md={4}>
                            {contributor?.investments !== undefined && (
                              <LinkContainer
                                to={`/all-topups/${contributor.investments[0]._id}`}
                              >
                                <Button block disabled>
                                  All TopUps
                                </Button>
                              </LinkContainer>
                            )}
                          </Col>

                          <Col md={4}></Col>
                          {(userInfo.data.user.role === "investment" ||
                            userInfo.data.user.role === "super-admin") && (
                            <Col md={4}>
                              {contributor?.investments !== undefined && (
                                <LinkContainer
                                  to={`/contribution/topup/${contributor.investments[0]._id}`}
                                >
                                  <Button block>New TopUp</Button>
                                </LinkContainer>
                              )}
                            </Col>
                          )}
                        </Row>
                      </ListGroup.Item>
                    </Card.Body>
                  </>
                )}
            </ListGroup>
          </Card>
        </>
      )}
    </>
  );
};

export default ContributorDetailsScreen;

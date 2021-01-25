import React, { useEffect } from "react";
import moment from "moment";
import { Card, ListGroup, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listAllInvestments } from "../actions/investmentActions";
import { listAllContributors } from "../actions/contributorActions";
import { listAllTopUps } from "../actions/topUpActions";
import { INVESTMENT_CONFIRM_RESET } from "../constants/investmentConstants";

const HomeScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const contributorList = useSelector((state) => state.contributorList);
  const {
    loading: contributorLoading,
    error: contributorError,
    allContributors,
  } = contributorList;
  const topUpList = useSelector((state) => state.topUpList);
  const { loading: topUpLoading, error: topUpError, allTopUps } = topUpList;

  const investmentList = useSelector((state) => state.investmentList);
  const { loading, error, allInvestments } = investmentList;

  const numberComma = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const unverifiedTopUp = allTopUps
    ?.filter(
      (topUp) =>
        topUp?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter((unverifiedTopUp) => unverifiedTopUp.topUpVerified === false);

  const noTopUpReceipt = allTopUps
    ?.filter(
      (topUp) =>
        topUp?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter(
      (noTopReceipt) =>
        noTopReceipt.topUpVerified === true &&
        noTopReceipt.invoicePrepared === false
    );

  const noTopUpMou = allTopUps
    ?.filter(
      (topUp) =>
        topUp?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter(
      (noTopReceipt) =>
        noTopReceipt.topUpVerified === true &&
        noTopReceipt.invoicePrepared === true &&
        noTopReceipt.mouPrepared === false
    );

  const unverifiedInvestment = allInvestments
    ?.filter(
      (investment) =>
        investment?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter(
      (unverifiedInvestment) =>
        unverifiedInvestment.investmentVerified === false
    );
  const receipt = allInvestments
    ?.filter(
      (investment) =>
        investment?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter(
      (noReceipt) =>
        noReceipt.investmentVerified === true &&
        noReceipt.invoicePrepared === false
    );

  const mou = allInvestments
    ?.filter(
      (investment) =>
        investment?.customer?.branch?.name === userInfo.data.user?.branch?.name
    )
    ?.filter(
      (noMou) =>
        noMou.investmentVerified === true &&
        noMou.invoicePrepared === true &&
        noMou.mouPrepared === false
    );

  useEffect(() => {
    if (userInfo !== null) {
      dispatch({ type: INVESTMENT_CONFIRM_RESET });
      dispatch(listAllInvestments());
      dispatch(listAllTopUps());
      dispatch(listAllContributors());
    } else {
      history.push("/login");
    }
  }, [dispatch, userInfo, history]);

  return (
    <>
      {userInfo !== null ? (
        <>
          <h1>Welcome {userInfo.data.user.lastName}</h1>
          <>
            <Card>
              <ListGroup>
                {/*TO CHECK THAT ROLE IS ASSIGNED TO ONLY SPECIAL DUTIES */}
                {(userInfo.data.user.role === "special-duties" ||
                  userInfo.data.user.role === "super-admin") && (
                  <>
                    <Card.Body>
                      <h2>UnConfirmed Contributions</h2>
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
                                <th>Bank of Payment </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {unverifiedInvestment.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">
                                    No Unconfirmed Contribution
                                  </td>
                                </tr>
                              ) : (
                                unverifiedInvestment?.map((invest) => (
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
                      <h2>UnConfirmed TopUps</h2>
                      <ListGroup.Item>
                        {topUpLoading ? (
                          <Loader />
                        ) : topUpError ? (
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
                                  Date of TopUp{" "}
                                  <Button className="btn btn-light">
                                    <i className="fas fa-sort"></i>
                                  </Button>
                                </th>
                                <th>Amount</th>
                                <th>Bank of Payment </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {unverifiedTopUp.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">No Unconfirmed Top-up</td>
                                </tr>
                              ) : (
                                unverifiedTopUp?.map((topUp) => (
                                  <tr key={topUp._id}>
                                    <td></td>
                                    <td>{topUp.customer?.fullName}</td>
                                    <td>
                                      {moment(topUp.createdAt).format(
                                        "Do MMMM YYYY"
                                      )}
                                    </td>
                                    <td>N{numberComma(topUp.topUpAmount)}</td>
                                    <td>{topUp.officialBank}</td>
                                    <td>{topUp.type}</td>
                                    <td>
                                      {userInfo.data.user.role ===
                                        "special-duties" ||
                                      userInfo.data.user.role ===
                                        "super-admin" ? (
                                        <Link
                                          to={`topup/verify-contribution/${topUp?._id}`}
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

                    {/*RECEIPT CHECK*/}

                    {/*RECEIPT CHECK*/}
                  </>
                )}

                {(userInfo.data.user.role === "accounts" ||
                  userInfo.data.user.role === "super-admin") && (
                  <>
                    <Card.Body>
                      <h2>GENERATE RECEIPTS (CONTRIBUTION)</h2>
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
                                  Date of Investment{" "}
                                  <Button className="btn btn-light">
                                    <i className="fas fa-sort"></i>
                                  </Button>
                                </th>
                                <th>Amount</th>
                                <th>Investment Duration </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {receipt.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">No receipt to Generate</td>
                                </tr>
                              ) : (
                                receipt?.map((newReceipt) => (
                                  <tr key={newReceipt._id}>
                                    <td></td>
                                    <td>{newReceipt.customer?.fullName}</td>
                                    <td>
                                      {moment(
                                        newReceipt.dateInvestVerify
                                      ).format("Do MMMM YYYY")}
                                    </td>
                                    <td>
                                      N
                                      {numberComma(newReceipt.investmentAmount)}
                                    </td>
                                    <td>{`${newReceipt.investmentDuration} months`}</td>
                                    <td>{newReceipt.type}</td>
                                    <td>
                                      {userInfo.data.user.role === "accounts" ||
                                      userInfo.data.user.role ===
                                        "super-admin" ? (
                                        <Link
                                          to={`/contribution/receipt/${newReceipt?._id}`}
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
                      <h2>GENERATE RECEIPTS (TOPUP)</h2>
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
                                  Date of TopUp{" "}
                                  <Button className="btn btn-light">
                                    <i className="fas fa-sort"></i>
                                  </Button>
                                </th>
                                <th>Amount</th>
                                <th>Investment Duration </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {receipt.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">No receipt to Generate</td>
                                </tr>
                              ) : (
                                noTopUpReceipt?.map((newReceipt) => (
                                  <tr key={newReceipt._id}>
                                    <td></td>
                                    <td>{newReceipt.customer?.fullName}</td>
                                    <td>
                                      {moment(
                                        newReceipt.dateTopUpVerify
                                      ).format("Do MMMM YYYY")}
                                    </td>
                                    <td>
                                      N{numberComma(newReceipt.topUpAmount)}
                                    </td>
                                    <td>{`${newReceipt.investmentDuration} months`}</td>
                                    <td>{newReceipt.type}</td>
                                    <td>
                                      {userInfo.data.user.role === "accounts" ||
                                      userInfo.data.user.role ===
                                        "super-admin" ? (
                                        <Link
                                          to={`/topup/receipt/${newReceipt?._id}`}
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

                {(userInfo.data.user.role === "legal" ||
                  userInfo.data.user.role === "super-admin") && (
                  <>
                    <Card.Body>
                      <h2>GENERATE MOU (INVESTMENT)</h2>
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
                                  Date of Investment{" "}
                                  <Button className="btn btn-light">
                                    <i className="fas fa-sort"></i>
                                  </Button>
                                </th>
                                <th>Amount</th>
                                <th>Investment Duration </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mou.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">No MOU to Generate</td>
                                </tr>
                              ) : (
                                mou?.map((newMou) => (
                                  <tr key={newMou._id}>
                                    <td></td>
                                    <td>{newMou.customer?.fullName}</td>
                                    <td>
                                      {moment(newMou.dateInvestVerify).format(
                                        "Do MMMM YYYY"
                                      )}
                                    </td>
                                    <td>
                                      N{numberComma(newMou.totalAmountInvested)}
                                    </td>
                                    <td>{`${newMou.investmentDuration} months`}</td>
                                    <td>{newMou.type}</td>
                                    <td>
                                      {userInfo.data.user.role === "legal" ||
                                      userInfo.data.user.role ===
                                        "super-admin" ? (
                                        <Link
                                          to={`/contribution/legal/${newMou?._id}`}
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
                      <h2>GENERATE MOU (TOPUP)</h2>
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
                                  Date of Investment{" "}
                                  <Button className="btn btn-light">
                                    <i className="fas fa-sort"></i>
                                  </Button>
                                </th>
                                <th>Amount</th>
                                <th>Investment Duration </th>
                                <th>Type </th>
                                <th>More</th>
                              </tr>
                            </thead>
                            <tbody>
                              {noTopUpMou?.length === 0 ? (
                                <tr>
                                  <td></td>
                                  <td colSpan="7">No MOU to Generate</td>
                                </tr>
                              ) : (
                                noTopUpMou?.map((newMou) => (
                                  <tr key={newMou._id}>
                                    <td></td>
                                    <td>{newMou.customer?.fullName}</td>
                                    <td>
                                      {moment(newMou.dateTopUpVerify).format(
                                        "Do MMMM YYYY"
                                      )}
                                    </td>
                                    <td>N{numberComma(newMou.topUpAmount)}</td>
                                    <td>{`${newMou.investment.investmentDuration} months`}</td>
                                    <td>{newMou.type}</td>
                                    <td>
                                      {userInfo.data.user.role === "legal" ||
                                      userInfo.data.user.role ===
                                        "super-admin" ? (
                                        <Link
                                          to={`/topup/legal/${newMou?._id}`}
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
                {/* THIS IS COMMENTED OUT
            {(userInfo.data.user.role === 'investment' ||
              userInfo.data.user.role === 'super-admin') && (
              <Card.Body>
                <h2>Contributors with no Contributions</h2>
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
                            Full Name{' '}
                            <Button className="btn btn-light">
                              <i className="fas fa-sort"></i>
                            </Button>
                          </th>
                          <th>
                            Date of Application{' '}
                            <Button className="btn btn-light">
                              <i className="fas fa-sort"></i>
                            </Button>
                          </th>
                          <th>Amount</th>
                          <th>Investment Officer </th>
                          <th>Type </th>
                          <th>More</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allContributors
                          .?filter(
                            (contributor) =>
                              contributor?.branch?.name ===
                              userInfo.data.user?.branch?.name
                          )
                          ?.map((customer) => (
                            <tr key={customer._id}>
                              <td></td>
                              <td>{customer.customer?.fullName}</td>
                              <td>
                                {moment(customer.createdAt).format(
                                  'Do MMMM YYYY'
                                )}
                              </td>
                              <td></td>
                              <td>{`${customer.investmentOfficer?.firstName} ${
                                customer.investmentOfficer?.lastName
                              } ${
                                customer.investmentOfficer?.otherName || ''
                              }`}</td>
                              <td>{customer.type}</td>
                              <td>
                                {userInfo.data.user.role === 'investment' ||
                                userInfo.data.user.role === 'super-admin' ? (
                                  <Link
                                    to={`/contribution/confirm-contribution/${customer?._id}`}
                                  >
                                    <i className="fas fa-info-circle"></i>
                                  </Link>
                                ) : (
                                  'Not Authorised'
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  )}
                </ListGroup.Item>
              </Card.Body>
            )}
          */}
              </ListGroup>
            </Card>
          </>
        </>
      ) : null}
    </>
  );
};

export default HomeScreen;

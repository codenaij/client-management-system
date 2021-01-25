import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import CreateBranchScreen from './screens/CreateBranchScreen';
import StaffRegisterScreen from './screens/StaffRegisterScreen';
import StaffListScreen from './screens/StaffListScreen';
import StaffDetailScreen from './screens/StaffDetailScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BranchListScreen from './screens/BranchListScreen';
import ContributorRegisterScreen from './screens/ContributorRegisterScreen';
import ContributorListScreen from './screens/ContributorListScreen';
import ContributionNewScreen from './screens/ContributionNewScreen';
import CreateTopUpScreen from './screens/CreateTopUpScreen';
import ContributionConfirmScreen from './screens/ContributionConfirmScreen';
import LegalMOUScreen from './screens/LegalMOUScreen';
import ReceiptGeneratorScreen from './screens/ReceiptGeneratorScreen';
import ContributorDetailsScreen from './screens/ContributorDetailsScreen';
import ContributorAuthScreen from './screens/ContributorAuthScreen';
import AllTopUpsScreen from './screens/AllTopUpsScreen';
import TopUpVerifyScreen from './screens/TopUpVerifyScreen';
import DuePaymentsScreen from './screens/DuePaymentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BranchEditScreen from './screens/BranchEditScreen';
import TopUpReceiptScreen from './screens/TopUpReceiptScreen';
import LegalMouTopScreen from './screens/LegalMouTopScreen';
import BMSummaryScreen from './screens/BMSummaryScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py3">
        <Container>
          <Route path="/branches" component={BranchListScreen} />
          <Route path="/create-branch" component={CreateBranchScreen} />
          <Route path="/branch/:id/edit" component={BranchEditScreen} />
          <Route path="/register-staff" component={StaffRegisterScreen} />
          <Route path="/staff/:id" component={StaffDetailScreen} />
          <Route path="/all-staff" component={StaffListScreen} />
          <Route path="/contributor/:id" component={ContributorDetailsScreen} />
          <Route path="/contributor-auth" component={ContributorAuthScreen} />
          <Route path="/business-summary" component={BMSummaryScreen} />
          <Route
            path="/contribution/new-contributor"
            component={ContributorRegisterScreen}
          />
          <Route path="/all-contributors" component={ContributorListScreen} />
          <Route
            path="/contribution/new-contribution/:id?"
            component={ContributionNewScreen}
          />
          <Route path="/contribution/topup/:id" component={CreateTopUpScreen} />
          <Route
            path="/contribution/confirm-contribution/:id"
            component={ContributionConfirmScreen}
          />
          <Route path="/contribution/legal/:id" component={LegalMOUScreen} />
          <Route path="/topup/legal/:id" component={LegalMouTopScreen} />
          <Route
            path="/contribution/receipt/:id"
            component={ReceiptGeneratorScreen}
          />
          <Route path="/topup/receipt/:id" component={TopUpReceiptScreen} />
          <Route path="/all-topups/:id" component={AllTopUpsScreen} />
          <Route
            path="/topup/verify-contribution/:id"
            component={TopUpVerifyScreen}
          />
          <Route path="/investment-list/:id?" component={DuePaymentsScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/" component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

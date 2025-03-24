import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/BaseLayout';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from './components/Home';
import CreateUser from './components/CreateUser'
import UserLogin from './components/UserLogin'
import Banks from './components/Banks'
import MachineTypes from './components/MachineTypes'
import Machines from './components/Machines'
import MoneyCreditDebit from './components/MoneyCreditDebit'
import Salary from './components/Salary'
import WorkingMachines from './components/WorkingMachines'
import MaintenanceTypes from './components/MaintenanceTypes'
import MachineMaintenance from './components/MachineMaintenance'
import ProjectTypes from './components/ProjectTypes'
import Projects from './components/Projects'
import ProjectMachines from './components/ProjectMachines'
import ProjectPersons from './components/ProjectPersons'
import PayTypes from './components/PayTypes'
import PersonTypes from './components/PersonTypes'
import Persons from './components/Persons'
import WorkTypes from './components/WorkTypes'
import MaterialTypes from './components/MaterialTypes'
import Materials from './components/Materials'
import ProjectMaterial from './components/ProjectMaterial'
import ProjectDayDetails from './components/ProjectDayDetails'
import Reports from './components/Reports'
import DailyReports from './components/DailyReports'
import MaterialReport from './components/MaterialReport'
// import PersonReport from './components/PersonReport'
import ProjectExpenses from './components/ProjectExpenses'
import PersonWorkMachines from './components/PersonWorkMachines'
import DocumentTypes from './components/DocumentTypes'
import Documents from './components/Documents'
import Single_project from './components/Single_project';
import CompanyDetails from './components/CompanyDetails';
import Diary from './components/diary';
import Machine_Rent from './components/Machine_Rent';
import Bill from './components/Bill';
import OverallReport from './components/Overall_Report';
import MachineReport from './components/machine_report';
import ProjectReports from './components/Project_report';
import PersonReport from './components/person_report';
import PersonBhaththuReport from './components/Bhaththu_report';
import ShowPerson_Report from './components/ShowPerson_Report';
import Bank_Credit_Report from './components/Bank_Credit_Report';
import Bank_Debit_Report from './components/Bank_Debit_Report';
import Maintenance_Report from './components/Maintenance_Report';
import CashReport from './components/CashReport';
import OffficeReport from './components/OffficeReport';
import { DateUserProvider } from './components/Context/ContextDataShare';


const App = () => { 
  return (
    <DateUserProvider>
    <Router>
      <Routes>
      
      <Route path="user-login/"  element={<UserLogin />} />
      
      <Route index element={<UserLogin />} />
        <Route path="/" element={<BaseLayout />}>
          
          <Route path="create-user" element={<CreateUser />} />
          
          <Route path="company-details" element={<CompanyDetails />} />
          <Route path="banks" element={<Banks />} />
          <Route path="machine-types" element={<MachineTypes />} />
          <Route path="machines" element={<Machines />} />
          <Route path="money-credit-debit" element={<MoneyCreditDebit />} />
          <Route path="salary" element={<Salary />} />
          <Route path="working-machines" element={<WorkingMachines />} />
          <Route path="maintenance-types" element={<MaintenanceTypes />} />
          <Route path="machine-maintenance" element={<MachineMaintenance />} />
          <Route path="project-types" element={<ProjectTypes />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-machines" element={<ProjectMachines />} />
          <Route path="project-persons" element={<ProjectPersons />} />
          <Route path="pay-types" element={<PayTypes />} />
          <Route path="person-types" element={<PersonTypes />} />
          <Route path="persons" element={<Persons />} />
          <Route path="work-types" element={<WorkTypes  />} />
          <Route path="material-types" element={<MaterialTypes  />} />
          <Route path="materials" element={<Materials  />} />
          <Route path="project-materials" element={<ProjectMaterial  />} />
          <Route path="project-day-details" element={<ProjectDayDetails  />} />
          <Route path="reports" element={<Reports  />} />
          <Route path="project-expenses" element={<ProjectExpenses  />} />
          <Route path="person-work-machine" element={<PersonWorkMachines  />} />
          <Route path="document-types" element={<DocumentTypes  />} />
          <Route path="documents" element={<Documents  />} />
          <Route path="daily-report" element={<DailyReports  />} />
          <Route path="material-report" element={<MaterialReport  />} />
          {/* <Route path="person-report" element={<PersonReport  />} /> */}
          <Route path="project/:project_id" element={<Single_project  />} />
          <Route path="diary" element={<Diary />} />
          <Route path="Machine_Rent" element={<Machine_Rent />} />
          <Route path="ProjectBill" element={<Bill />} />
          <Route path='OverallReport' element={<OverallReport />} />
          <Route path='MachineReport' element={<MachineReport />} />
          <Route path='ProjectReports' element={<ProjectReports />} />
          <Route path='PersonReports' element={<PersonReport />} />
          <Route path='PersonBhaththuReport' element={<PersonBhaththuReport />} />
          <Route path='ShowPerson_Report' element={<ShowPerson_Report />} />
          <Route path='Bank_Credit_Report' element={<Bank_Credit_Report />} />
          <Route path='Bank_Debit_Report' element={<Bank_Debit_Report />} />
          <Route path='Maintenance_Report' element={<Maintenance_Report />} />
          <Route path='CashReport' element={<CashReport />} />
          <Route path='OffficeReport' element={<OffficeReport />} />
        </Route>
      </Routes>
    </Router>
    </DateUserProvider>
  );
};

export default App;

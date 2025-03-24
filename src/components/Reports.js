import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Ensure you have installed 'react-select'
import { useParams, useLocation, Link } from 'react-router-dom';

const Reports = () => {
    return (
        <div>
            <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">
                REPORTS
            </h5>

            <div className='grid grid-cols-3 gap-2 mb-3'>
            <Link to="/ProjectReports/"><div className='card'>Project Report</div></Link>
            <Link to="/MachineReport/"><div className='card'>Machine Report</div></Link>
            <Link to="/daily-report/"><div className='card'>Daily Report</div></Link>
            <Link to="/OverallReport/"><div className='card'>Overall Report</div></Link>
            <Link to="/material-report/"><div className='card'>Material Report</div></Link>
            <Link to="/PersonReports/"><div className='card'>Person Report</div></Link>
            <Link to="/PersonBhaththuReport/"><div className='card'>Bhaththu Report</div></Link>
            <Link to="/ShowPerson_Report/"><div className='card'>Show Person Report</div></Link>
            <Link to="/Bank_Credit_Report/"><div className='card'>Bank Credit Report</div></Link>
            <Link to="/Bank_Debit_Report/"><div className='card'>Bank Debit Report</div></Link>
            <Link to="/Maintenance_Report/"><div className='card'>Maintenance Report</div></Link>
            <Link to="/CashReport/"><div className='card'>Cash Report</div></Link>
            <Link to="/OfficeReport/"><div className='card'>Office Report</div></Link>
            </div>
        </div>





    );
};

export default Reports;
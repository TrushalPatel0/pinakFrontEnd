import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import './mystyle.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import { backendurl } from './backend_url';

function BaseLayout() {
  const urll = backendurl();
  const [hisab, sethisab] = useState({});
  const [lang, setlang] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const response = axios.get(`${urll}language_data?language_change=${value}`);
    setlang(value)
    window.location.reload();
  };

  const fetchhisabkitab = async () => {
    try {
      const response = await axios.get(`${urll}rokad_cash_calculation/`);
      sethisab(response.data)
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchhisabkitab();
  }, []);

  return (
    <>
 
  <button
    data-drawer-target="default-sidebar"
    data-drawer-toggle="default-sidebar"
    aria-controls="default-sidebar"
    type="button"
    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  >
    <span className="sr-only">સિડેમેનું ઓપન કરો</span>
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button>
  <aside
    id="default-sidebar"
    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidenav"
  >
    <div className="overflow-y-auto py-2 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div className="mb-2 flex justify-start items-center">
            <img
              src="/static/pinak enterprise gujrati logo_page-0001.jpg"
              alt="Logo"
              className="w-40 rounded-full"
            />
    </div>
    <hr/>
      <ul className="space-y-2 mt-2">
        <li>
        <Link to="company-details/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-regular fa-building iconsize"></i></span>
            <span className="ml-3">કંપની</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="banks/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-building-columns iconsize"></i></span>
            <span className="ml-3">બૅંક</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="machines/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-tractor iconsize"></i></span>
            <span className="ml-3">મશીન</span>
          </a>
          </Link>
        </li>


        <li>
        <Link to="machine-maintenance/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-screwdriver-wrench iconsize"></i></span>
            <span className="ml-3">મરામત</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="projects/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-poo-storm iconsize"></i></span>
            <span className="ml-3">પ્રોજેક્ટસ</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="persons/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-user-group iconsize"></i></span>
            <span className="ml-3">વ્યક્તિ</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="materials/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-recycle iconsize"></i></span>
            <span className="ml-3">મટિરિયલ</span>
          </a>
          </Link>
        </li>

        <li>
        <Link to="reports/">
          <a
            href="#"
            className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <span><i class="fa-solid fa-chart-simple iconsize"></i></span>
            <span className="ml-3">રિપોર્ટ્સ</span>
          </a>
          </Link>
        </li>
      </ul>
    
      <select name='language' onChange={handleChange}>
        <option value=''>Language</option>
        <option value='gujarati'>Gujarati</option>
        <option value='english'>English</option>
      </select>
    </div>
    
    
  </aside>
    
      <div className='maincontent'>
        
        <div class="grid grid-cols-4 md:grid-cols-12 gap-2 md:gap-4 mb-3 iconsection">
        <Link to="banks/"><div className='card text-center'>
            <div className='icondiv'><img src='/static/icons/bank.png' className='iconimg' /></div>
            બૅંક
            </div></Link>
           
            <Link to="persons/"><div className='card text-center'>
           <div className='icondiv'><img src='/static/icons/team.png' className='iconimg' /></div>
           વ્યક્તિ
           </div></Link>
           <Link to="salary/"><div className='card text-center'>
           <div className='icondiv'><img src='/static/icons/wages.png' className='iconimg' /></div>પગાર</div></Link>
           <Link to="machines/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/drilling-machine.png' className='iconimg' /></div>મશીન</div></Link>
           <Link to="machine-maintenance/"><div className='card text-center'><div className='iconDiv'><img src='/static/icons/maintenance.png' className='iconimg' /></div>મરામત</div></Link>
           <Link to="projects/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/clipboard.png' className='iconimg' /></div>પ્રોજેક્ટ</div></Link>
           <Link to="materials/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/material-management.png' className='iconimg' /></div>મટિરિયલ</div></Link>
           <Link to="money-credit-debit/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/credit.png' className='iconimg' /></div>આવક/જાવક</div></Link>
           <Link to="documents/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/folders.png' className='iconimg' /></div>ડોક્યુમેંટ્સ</div></Link>
           <Link to="company-details/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/enterprise.png' className='iconimg' /></div>કંપની</div></Link>
           <Link to="reports/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/analysis.png' className='iconimg' /></div>રિપોર્ટ્સ</div></Link>
           <Link to="diary/"><div className='card text-center'><div className='icondiv'><img src='/static/icons/notebook.png' className='iconimg' /></div>ડાયરી</div></Link>

        </div>
        {hisab && (
            <div class="grid grid-cols-4 md:grid-cols-22 gap-2 md:gap-4 mb-3 iconsection">
            <div className='card font-bold d-inline-block'>કુલ રોકડ રકમ : <span className='text-success'><i class="fa-solid fa-indian-rupee-sign"></i> {hisab.current_rokad_amount}</span></div>
            <div className='card font-bold d-inline-block'>કુલ બેન્ક રકમ : <span className='text-success'><i class="fa-solid fa-indian-rupee-sign"></i> {hisab.kul_bank_amount}</span></div>

            <div className='card d-inline-block font-bold'>કુલ લેવાની રકમ : {(hisab.kul_levani_baki_rakam < 0) ? (<><span className='text-danger d-inline font-semibold'><i class="fa-solid fa-indian-rupee-sign"></i> {-1*hisab.kul_levani_baki_rakam}</span></>) : (<span className='text-success inline font-semibold'><i class="fa-solid fa-indian-rupee-sign"></i> {hisab.kul_levani_baki_rakam}</span>) || 0}</div>
            <div className='card d-inline-block font-bold'>કુલ આપવાની રકમ : {(hisab.kul_aapvani_baki_rakam < 0) ? (<><span className='text-success font-semibold'><i class="fa-solid fa-indian-rupee-sign"></i> {-1*hisab.kul_aapvani_baki_rakam}</span></>) : (<><span className='text-danger font-semibold'><i class="fa-solid fa-indian-rupee-sign"></i> {hisab.kul_aapvani_baki_rakam}</span></>) || 0}</div>
            <div className='card d-inline-block font-bold'>{(hisab.kul_rakam < 0) ? (<><span className='text-danger font-bold'>આપવાની બાકી રકમ : <i class="fa-solid fa-indian-rupee-sign"></i> {-1*hisab.kul_rakam}</span></>) : (<><span className='text-success font-semibold'>લેવાની બાકી રકમ : <i class="fa-solid fa-indian-rupee-sign"></i> {hisab.kul_rakam}</span></>) || 0}</div>
          </div>
        )}
        

        <hr/>
        
      <Outlet />
      <hr/>
     
      </div>
    </>
  )
}

export default BaseLayout
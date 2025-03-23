import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams, useLocation, Link } from 'react-router-dom';
import { backendurl } from './backend_url';



function Bill(){
    const urll = backendurl();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const projecttt_id = query.get('projecttt_id');
    const [bill_data, setbill_data] = useState([]);
    const [project_day_details_data, setproject_day_details_data] = useState([]);
    const printableRef = useRef(null);
    const [total_amount,settotal_amount]=useState(0);
    const [discount,setdiscount]=useState(0);   
    const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [title, setTitle] = useState('');
        const [Messages, setMessages] = useState('');


    // Fetch machine details
    const fetchbill_data = async () => {
        try {
            const response = await axios.get(`${urll}show_bill?project_id=${projecttt_id}`);
            setbill_data(response.data.data || []);
            console.log(response.data.data)
            setproject_day_details_data(response.data.project_day_details_data || []);
            settotal_amount(response.data.total_amount)
            setdiscount(response.data.discount)
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load Machines details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchbill_data();
    }, []);

    

    useEffect(() => {
        if (Messages) {
            const timer = setTimeout(() => {
                setMessages('');  // Clear success message after 3 seconds
            }, 3000);  // 3000 milliseconds = 3 seconds

            // Cleanup the timer if the component is unmounted or successMessage changes
            return () => clearTimeout(timer);
        }
    }, [Messages]);


    const generatePDF = () => {
      const input = document.querySelector(".printablearea");
      if (input) {
        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("invoice.pdf");
        }).catch((error) => {
          console.error("Error generating PDF:", error);
        });
      }
    };

  return (
    <>
    <div className="mt-4 flex justify-center">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mb-3"
        >
          Download PDF
        </button>
      </div>
    {bill_data.length > 0 &&(

    <div className="printablearea" >
    <div className="bg-gray-100 p-6">
  <div className="bg-white p-6 rounded-lg shadow-lg" ref={printableRef}>
    <div className="flex justify-between items-center mb-4">
      <img src="/static/pinak enterprise gujrati logo_page-0001.jpg" alt="Company Logo" style={{width:" 200px"}} />
      <div className="text-right">
        <h2 className="text-xl font-bold">INVOICE</h2>
        <p className="text-gray-600">તારીખ: {bill_data[0].invoice_date}</p>
        <p className="text-gray-600">બિલ નંબર: {bill_data[0].invoice_number}</p>
      </div>
    </div>
    <div className="flex justify-between mb-4">
      <div className="w-70">
        <h3 className="text-lg font-semibold">From:</h3>
        <p>પિનાક એન્ટરપ્રાઇજ</p>
        <p>પ્રથમ માળ, દુકાન નં. બી-143150, અલીફ પ્લાઝા, હોટેલ સ્વાદ ની સામે, હાઇવે રોડ, કનોદર-385520</p>
        <p>ફોન : 9601028888</p>
        <p>GSTIN: 24AILPB9447R1ZK</p>
        <p>PAN: AILPB9447R</p>
      </div>
      <div className="text-right">
        <h3 className="text-lg font-semibold">To:</h3>
        <p>{bill_data[0].Project_id__project_owner_name__person_name}</p>
        <p>{bill_data[0].Project_id__project_owner_name__person_contact_number}</p>
        <p>{bill_data[0].Project_id__project_owner_name__person_address}</p>
        <p>GSTIN:{bill_data[0].Project_id__project_owner_name__person_gst}</p>
      </div>
    </div>
    <div className="mb-4">
      <h3 className="text-lg font-semibold">પ્રોજેક્ટ સ્થળ:</h3>
      <p>{bill_data[0].Project_id__project_location}</p>
    </div>
    <table className="min-w-full border-collapse border border-gray-300 mb-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 p-2">ક્રમ</th>
          <th className="border border-gray-300 p-2">તારીખ</th>
          <th className="border border-gray-300 p-2">મશીન માહિતી</th>
          <th className="border border-gray-300 p-2">કામ ની માહિતી</th>
          <th className="border border-gray-300 p-2">પ્રકાર</th>
          <th className="border border-gray-300 p-2">ટાયર</th>
          <th className="border border-gray-300 p-2">સંખ્યા</th>
          <th className="border border-gray-300 p-2">ભાવ (₹)</th>
          <th className="border border-gray-300 p-2">કુલ કિમત (₹)</th>
        </tr>
      </thead>
      <tbody>
      {project_day_details_data.length > 0 &&(
        project_day_details_data.map((y,index) => (
        <tr>
          <td className="border border-gray-300 p-2">{index+1 }</td>
          <td className="border border-gray-300 p-2">{y.proejct_day_detail_date}</td>
          <td className="border border-gray-300 p-2">{y.project_day_detail_machine_id__machine_name} ({y.project_day_detail_machine_id__machine_number_plate})</td>
          <td className="border border-gray-300 p-2">{y.project_day_detail_details}</td>
          <td className="border border-gray-300 p-2">{y.project_day_detail_work_type__work_type_name}</td>
          <td className="border border-gray-300 p-2">{y.project_day_detail_total_tyres}</td>
          <td className="border border-gray-300 p-2">{y.project_day_detail_work_no}</td>
          <td className="border border-gray-300 p-2">₹{y.project_day_detail_price}</td>
          <td className="border border-gray-300 p-2">₹{y.project_day_detail_total_price}</td>
        </tr>
        ))
      )}
        <tr className="bg-gray-200">
          <td className="border border-gray-300 p-2" colSpan={8}>Subtotal</td>
          <td className="border border-gray-300 p-2">₹{total_amount}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-2" colSpan={8}>Discount</td>
          <td className="border border-gray-300 p-2">₹{discount}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-2" colSpan={8}>GST</td>
          <td className="border border-gray-300 p-2">₹{(total_amount - discount)*18/100}</td>
        </tr>
        <tr className="bg-gray-200">
          <td className="border border-gray-300 p-2" colSpan={8}>Total Amount</td>
          <td className="border border-gray-300 p-2">₹{((total_amount - discount)*18/100)+total_amount-discount}</td>
        </tr>
      </tbody>
    </table>
    {/* <div className="mb-4">
      <h3 className="text-lg font-semibold">Total Amount in Words:</h3>
      <p>[Total Amount in Words]</p>
    </div> */}
    <div className="flex justify-between gap-2 mb-4">
      
      <div className="text-left bg-slate-50 p-2">
        <h3 className="text-lg font-semibold">Conditions:</h3>
        <ol className="list-decimal list-outside">
          <li>પાલનપુર અધિકાર ક્ષેત્ર ને આધીન</li>
          <li>નિયત તારીખ પછી ચૂકવેલ બિલ પર 18% વ્યાજ લેવામાં આવસે.</li>
          <li>એકવાર વેચાયેલ માલ પરત કરવામાં આવસે નહીં કે વિનિમય કરવામાં આવસે નહીં.</li>
          <li>અમારી જોખમ ની જવાબદારી ટ્રાન્સપોર્ટ(શીપ કે રેલવે) સુધી મર્યાદિત છે.</li>
        </ol>
      </div>

      <div className="bg-slate-50 p-2">
        <h3 className="text-lg font-semibold">Company Bank Details:</h3>
        <p>Bank: HDFC BANK</p>
        <p>Account No: 50200089833550</p>
        <p>IFSC: HDFC0000335</p>
      </div>
      
    </div>
    <div className="flex justify-between mt-6">
      <div>
        <h3 className="text-lg font-semibold">Authorized Signature:</h3>
        <div className="border-t border-gray-300 mt-2 pt-2">
          <p></p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Receiver Signature:</h3>
        <div className="border-t border-gray-300 mt-2 pt-2">
          <p>_________________________</p>
          <p>[Receiver Name]</p>
        </div>
      </div>
    </div>
    <div className="mt-6 text-center">
      <p className="text-gray-400">Thank you for your Business. This is computer generated Invoice.</p>
    </div>
  </div>
</div>
</div>
)}
    </>
  )
}

export default Bill
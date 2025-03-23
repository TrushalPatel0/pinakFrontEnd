import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MaterialReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/show_material_report/")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">Error: {error}</p>;

  return (
    <div className="mt-4">
      <h5 className="fw-bold text-primary text-center">મટિરિયલ રિપોર્ટ</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>મટિરિયલ માલિક</th>
              <th>લોકેશન</th>
              <th>કુલ આવક</th>
              <th>પડતર કિમત</th>
              <th>દલાલી રકમ</th>
              <th>નફો/નુકસાન</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data["Material Owner Name"]}</td>
              <td>{data.location}</td>
              <td>&#8377; {data.total_aavak}</td>
              <td>&#8377; {data.padatar_rakam}</td>
              <td>&#8377; {data.dalali_rakam}</td>
              <td className={data.profit_loss < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                &#8377; {data.profit_loss}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {data.projectwiseData.map((project, index) => (
        <div key={index} className="mt-1">
          
          <div className="grid grid-cols-8 gap-1">
            <div className="col-span-2 md:col-span-1 border flex items-center justify-center font-semibold border-r-0" style={{backgroundColor:'#CFE2FF'}}>{project.project_name}</div>
            <div className="col-span-6 md:col-span-7">
            <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-primary">
                <tr>
                  <th>કામ ની સંખ્યા</th>
                  <th>ભાવ</th>
                  <th>કુલ રકમ</th>
                  <th>વિગત</th>
                </tr>
              </thead>
              <tbody>
                {project.Project_par_fera.map((item, i) => (
                  <tr key={i}>
                    <td>{item.project_material_work_no}</td>
                    <td>&#8377; {item.project_material_price}</td>
                    <td>&#8377; {item.project_material_total_amount}</td>
                    <td>{item.person_material_information || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default MaterialReport;

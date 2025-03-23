import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import ProjectMachines from "./ProjectMachines";
import ProjectDayDetails from "./ProjectDayDetails";
import ProjectMaterial from "./ProjectMaterial";
import ProjectPersons from "./ProjectPersons";
import ProjectExpenses from "./ProjectExpenses";
import Reports from "./Reports";
import useLanguageData from "./languagedata";
import { backendurl } from './backend_url';


function SingleProject() {
  const urll = backendurl();
  const { languageData } = useLanguageData([]);
  const { project_id } = useParams();
  const [singleprojectdata, setSingleProjectData] = useState({});
  const [project_saransh, setproject_saransh] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response
  const [sectionname, setSectionName] = useState("");
  
  const fetchProject = async (projectId) => {
    try {
      const response = await axios.get(
        `${urll}single_project_data/`,
        {
          params: { project_id: projectId }, // Pass project_id as a query parameter
        }
      );
      console.log(response.data.data);
      setSingleProjectData(response.data.data || {});
      setproject_saransh(response.data.project_saransh || {});
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load project details");
      setLoading(false);
    }
  };

  const sectionss = async (sectionss) => {
    setSectionName(sectionss);
  };
  // Fetch project data on component mount
  useEffect(() => {
    fetchProject(project_id);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>પ્રોજેક્ટ : {title}</h3>
      <hr />

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div className="p-1">
          <span className="font-semibold">પ્રોજેક્ટ નામ : </span>{" "}
          {singleprojectdata.project_name}
        </div>
        <div className="p-1">
          <span className="font-semibold">કુલ કિમત:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.grahak_kul_rakam}
        </div>
        <div className="p-1">
          <span className="font-semibold">લોકેશન:</span>{" "}
          {singleprojectdata.project_location}
        </div>
        <div className="p-1">
          <span className="font-semibold">પ્રકાર:</span>{" "}
          {singleprojectdata.project_type_name}
        </div>
        <div className="p-1">
          <span className="font-semibold">સ્ટેટસ:</span>{" "}
          {singleprojectdata.project_status}
        </div>
        <div className="p-1">
          <span className="font-semibold">શરૂઆત તારીખ:</span>{" "}
          {singleprojectdata.project_start_date}
        </div>
        <div className="p-1">
          <span className="font-semibold">આખરી તારીખ :</span>{" "}
          {singleprojectdata.project_end_date}
        </div>
        <div className="p-1">
          <span className="font-semibold">કસ્ટમર નામ:</span>{" "}
          {singleprojectdata.project_owner_name || "N/A"}
        </div>
        <div className="p-1">
          <span className="font-semibold">કસ્ટમર નંબર:</span>{" "}
          {singleprojectdata.project_owner_contact_number || "N/A"}
        </div>
  
        

        <div className="p-1">
          <span className="font-semibold">કુલ ચૂકવેલ રકમ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.kul_chukvel_rakam}
        </div>

        <div className="p-1">
          <span className="font-semibold">કુલ મશીન ખર્ચ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.machine_kharch}
        </div>

        <div className="p-1">
          <span className="font-semibold">કુલ મરામત ખર્ચ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.maramat_kharch}
        </div>

        <div className="p-1">
          <span className="font-semibold">કુલ વ્યક્તિ ખર્ચ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.vyakti_kharch}
        </div>


        <div className="p-1">
          <span className="font-semibold">કુલ માટેરિયલ ખર્ચ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.material_kharch}
        </div>

        <div className="p-1">
          <span className="font-semibold">કુલ સરેરાસ ખર્ચ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.sareras_kharch}
        </div>

        <div className="p-1">
          <span className="font-semibold">ડિસ્કાઉન્ટ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.discount}
        </div>

        <div className="p-1">
          <span className="font-semibold">દલાલી:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.dalali_amt}
        </div>

        <div className="p-1">
          <span className="font-semibold">પડતર કિમત:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.padatar_rakam}
        </div>

        <div className="p-1">
          <span className="font-semibold">ગ્રાહક કુલ રકમ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.grahak_kul_rakam}
        </div>

        <div className="p-1">
          <span className="font-semibold">ગ્રાહકે ચૂકવેલ રકમ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.grahak_paid_amount_for_project || 0}
        </div>

        {singleprojectdata.project_investor && (
          <>
        <div className="p-1">
          <span className="font-semibold">મૂડીરોકાણકાર :</span>{" "}
          {singleprojectdata.project_investor_name || "N/A"}
          ({singleprojectdata.project_investor_percentage || "N/A"}%)
        </div>

        <div className="p-1">
          <span className="font-semibold">મૂડીરોકાણ રકમ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {singleprojectdata.project_investor_amount}
        </div>

        <div className="p-1">
          <span className="font-semibold">મૂડીરોકાણકાર ને ચૂકવવાની રકમ:</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.mudirokankar_bhag_amount}
        </div>
        </>
        )}

        

        <div className="p-1">
          
        {project_saransh.profit_loss > 0 ? (
          <div className="text-success">
          <span className="font-semibold">નફો/નુકસાન :</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.profit_loss}
        </div>
        ) : (
          <div className="text-danger">
          <span className="font-semibold">નફો/નુકસાન :</span>{" "}
          <i class="fa-solid fa-indian-rupee-sign"></i> {project_saransh.profit_loss}
        </div>
        )}
        </div>

        <Link to={`/ProjectBill/?projecttt_id=${project_id}`}><div>View Bill</div></Link>
        
      </div>
      <hr />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 mt-3">
      <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectdaydetail")}
        >
          <i class="fa-regular fa-sun text-xl"></i> દિવસ ડીટેલ
        </div>
        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectmachine")}
        >
          <i class="fa-solid fa-van-shuttle text-xl"></i> મશીન
        </div>
        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectperson")}
        >
          <i class="fa-solid fa-person text-xl"></i> વ્યક્તિ
        </div>

        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectexpense")}
        >
          <i class="fa-solid fa-sack-dollar text-xl"></i> સરેરાસ ખર્ચ
        </div>

        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectmaterial")}
        >
          <i class="fa-solid fa-water text-xl"></i> મટિરિયલ
        </div>
        <Link to={`/ProjectReports?projecttt_id=${project_id}`}><div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
        >
          <i class="fa-solid fa-chart-bar text-xl"></i> પ્રોજેક્ટ રિપોર્ટ
        </div></Link>


      </div>

<div className="mt-3">
{sectionname === "projectdaydetail" && <ProjectDayDetails project_id={project_id} />}

{sectionname === "projectmachine" && <ProjectMachines project_id={project_id} />}



{sectionname === "projectperson" && <ProjectPersons project_id={project_id} />}

{sectionname === "projectexpense" && <ProjectExpenses project_id={project_id} />}

{sectionname === "projectmaterial" && <ProjectMaterial project_id={project_id} />}

</div>
    </div>
  );
}

export default SingleProject;
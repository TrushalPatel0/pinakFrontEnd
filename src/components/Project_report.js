import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Ensure you have installed 'react-select'
import { useParams, useLocation, Link } from 'react-router-dom';
import { backendurl } from './backend_url';

const ProjectReports = () => {
    const urll = backendurl();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const projecttt_id = query.get('projecttt_id');

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [projectID, setProjectID] = useState('');

    const [singleprojectdata, setsingleprojectdata] = useState(null)
    const [projectMachineData, setProjectMachineData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [ProjectDayDetailsData, setProjectDayDetailsData] = useState([]);
    const [ProjectDayDetailsTotalAmount, setProjectDayDetailsTotalAmount] = useState(0);
    const [ProjectPersonData, setProjectPersonData] = useState([]);
    const [ProjectPersonTotalAmount, setProjectPersonTotalAmount] = useState(0);
    const [finalTotalAmount, setFinalTotalAmount] = useState(0);
    const [ProjectExpenseData, setProjectExpenseData] = useState([]);
    const [ProjectExpenseTotalAmount, setProjectExpenseTotalAmount] = useState(0);
    const [MachineMaintenanceData, setMachineMaintenanceData] = useState([]);
    const [MachineMaintenanceTotalAmount, setMachineMaintenanceTotalAmount] = useState(0);
    const [ProjectMaterialData, setProjectMaterialData] = useState([]);
    const [ProjectMaterialTotalAmount, setProjectMaterialTotalAmount] = useState(0);

    const [showProjectMachine, setShowProjectMachine] = useState(true);
    const [showProjectDayDetails, setShowProjectDayDetails] = useState(true);
    const [showProjectPerson, setShowProjectPerson] = useState(true);
    const [showProjectExpense, setShowProjectExpense] = useState(true);
    const [showProjectMachineMaintenance, setShowProjectMachineMaintenance] = useState(true);
    const [showProjectMaterial, setShowProjectMaterial] = useState(true);


    const projectOptions = [
        { value: '', label: 'પ્રોજેક્ટ સિલેક્ટ કરો' },
        ...projects.map((project) => ({
            value: project.project_id,
            label: project.project_name,
        })),
    ];

    useEffect(() => {
        axios
            .get(`${urll}show_reports/`)
            .then((response) => {
                if (response.data.status === 'success') {
                    setProjects(response.data.data);
                } else {
                    console.error('Failed to fetch projects');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                setLoading(false);
                setError('Failed to load projects.');
            });

            if(projecttt_id){
                setProjectID(projecttt_id);
                const projectt_id = {value: projecttt_id, label: ''}
                handleProjectChange(projectt_id)
                
            }
            
    }, []);


    
    const handleProjectChange = async (selectedOption) => {
        console.log(selectedOption)
        let newProjectID = selectedOption ? selectedOption.value : '';
        setProjectID(newProjectID); // Update the state
        if (!newProjectID) {
            setProjectMachineData([]);
            setProjectDayDetailsData([]);
            setTotalAmount(0);
            return;
        }

        setLoading(true); // Show loading indicator
        try {
            const project_machine_response = await axios.get(
                `${urll}show_project_machine/?project_id=${newProjectID}`
            );
            setProjectMachineData(project_machine_response.data.data || []);
            setTotalAmount(project_machine_response.data.total_amount || 0);

            const project_day_detail_response = await axios.get(
                `${urll}show_project_day_details/?project_id=${newProjectID}`
            );
            setProjectDayDetailsData(project_day_detail_response.data.data || []);
            setProjectDayDetailsTotalAmount(project_day_detail_response.data.total_amount || 0);

            const project_person_response = await axios.get(`${urll}show_project_person/?project_id=${newProjectID}`);

            setsingleprojectdata(project_person_response.data.project_data)
            setProjectPersonData(project_person_response.data.data || []);
            setProjectPersonTotalAmount(project_person_response.data.total_amount || 0);


            const project_expense_response = await axios.get(`${urll}show_project_expense/?project_id=${newProjectID}`);
            setProjectExpenseData(project_expense_response.data.data || []);
            setProjectExpenseTotalAmount(project_expense_response.data.total_amount || 0);

            const machine_maintenance_response = await axios.get(`${urll}show_machine_maintenance/?project_id=${newProjectID}`);
            setMachineMaintenanceData(machine_maintenance_response.data.data || []);
            setMachineMaintenanceTotalAmount(machine_maintenance_response.data.total_amount || 0);

            const project_material_response = await axios.get(`${urll}show_project_material/?project_id=${newProjectID}`);
            setProjectMaterialData(project_material_response.data.data || []);
            setProjectMaterialTotalAmount(project_material_response.data.total_amount || 0);

            setError(null);
        } catch (err) {
            console.error('Error fetching project machine data:', err);
            setError('Failed to load project machine details');
        } finally {
            setLoading(false); // Hide loading
        }
    };
    useEffect(() => {
        let total = 0;

        if (showProjectDayDetails) {
            total += ProjectDayDetailsTotalAmount;
        }

        setFinalTotalAmount(total);
    }, [totalAmount, ProjectDayDetailsTotalAmount, ProjectPersonTotalAmount, showProjectMachine, showProjectDayDetails, showProjectPerson]);


    return (
        <div>
            <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">
                Project Report
            </h5>
            <Select
                options={projectOptions}
                value={projectOptions.find((option) => option.value === projectID)}
                onChange={handleProjectChange}
                placeholder="પ્રોજેક્ટ સિલેકટ કરો"
                isSearchable
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{ container: (base) => ({ ...base, width: '300px' }) }}
            />

{singleprojectdata && (
    <>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-6">


            <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectdaydetail" checked={showProjectDayDetails}
                        onChange={() => setShowProjectDayDetails(!showProjectDayDetails)} />
                    <label class="form-check-label" for="projectdaydetail">
                        દિવસ ડીટેલ
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmachine" checked={showProjectMachine}
                        onChange={() => setShowProjectMachine(!showProjectMachine)} />
                    <label class="form-check-label" for="projectmachine">
                        પ્રોજેક્ટ મશીન
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmachinemaintenance" checked={showProjectMachineMaintenance}
                        onChange={() => setShowProjectMachineMaintenance(!showProjectMachineMaintenance)} />
                    <label class="form-check-label" for="projectmachinemaintenance">
                        મશીન મરામત
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmaterial" checked={showProjectMaterial}
                        onChange={() => setShowProjectMaterial(!showProjectMaterial)} />
                    <label class="form-check-label" for="projectmachinemaintenance">
                        પ્રોજેક્ટ મટિરિયલ
                    </label>
                </div>


                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="Project_Person" checked={showProjectPerson}
                        onChange={() => setShowProjectPerson(!showProjectPerson)} />
                    <label class="form-check-label" for="Project_Person">
                      પ્રોજેક્ટ વ્યક્તિ/ભથ્થું
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="Project_Expense" checked={showProjectExpense}
                        onChange={() => setShowProjectExpense(!showProjectExpense)} />
                    <label class="form-check-label" for="Project_Expense">
                        સરેરાસ ખર્ચ
                    </label>
                </div>

            </div>

            
                <div className='card mt-4 reportbackground p-4'>

                    <div className="mb-2 flex justify-center items-center">
                        <img
                            src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                            alt="Logo"
                            className="w-20 rounded-full"
                        />
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 mb-4 mt-4'>
                        <h6>પ્રોજેક્ટ નામ : {singleprojectdata.project_name}</h6>
                        <h6>રકમ : {singleprojectdata.project_amount}</h6>
                        <h6>સ્થળ : {singleprojectdata.project_location}</h6>
                        <h6>પ્રોજેક્ટ પ્રકાર : {singleprojectdata.project_type}</h6>
                        <h6>સ્ટેટસ : {singleprojectdata.project_status}</h6>
                        <h6>સરૂઆત તારીખ : {singleprojectdata.project_start_date}</h6>
                        <h6>અંત તારીખ : {singleprojectdata.project_end_date}</h6>
                        <h6>પ્રોજેક્ટ માલિક : {singleprojectdata.owner_name}</h6>
                        <h6>ફોન નંબર : {singleprojectdata.owner_contact_number}</h6>
                    </div>
                    
                    <div className='grid grid-cols-2 md:grid-cols-6 mb-3 gap-2'>
                        <div className='card'>દિવસ ડીટેલ : {ProjectDayDetailsTotalAmount}</div>
                        <div className='card'>મશીન ખર્ચ : {totalAmount}</div>
                        <div className='card'>મરામત ખર્ચ : {MachineMaintenanceTotalAmount}</div>
                        <div className='card'>વ્યક્તિ ખર્ચ : {ProjectPersonTotalAmount}</div>
                        <div className='card'>મટિરિયલ ખર્ચ : {ProjectMaterialTotalAmount}</div>
                        <div className='card'>સરેરાસ ખર્ચ : {ProjectExpenseTotalAmount}</div>
                        <div className='card'>પડતર કિમત : {totalAmount+MachineMaintenanceTotalAmount+ProjectPersonTotalAmount+ProjectMaterialTotalAmount+ProjectExpenseTotalAmount}</div>
                        <div className='card'>ડિસ્કાઉન્ટ : {singleprojectdata.project_discount || 0}</div>
                        <div className='card'>નફો/નુકસાન : {ProjectDayDetailsTotalAmount - totalAmount-MachineMaintenanceTotalAmount-ProjectPersonTotalAmount-ProjectMaterialTotalAmount-ProjectExpenseTotalAmount -(singleprojectdata.project_discount || 0)}</div>
                    </div>
                    {showProjectDayDetails && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Day-Details</div>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ક્રમ </th>
                                                <th>તારીખ</th>
                                                <th>મશીન નામ</th>
                                                <th>કામ ના પ્રકાર</th>
                                                <th>ટાયર</th>
                                                <th>કામ</th>
                                                <th>ભાવ</th>
                                                <th>કુલ ભાવ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProjectDayDetailsData.length > 0 && (
                                                ProjectDayDetailsData.map((detail, index) => (
                                                    <tr key={detail.project_day_detail_id}>
                                                        <td>{index + 1 || "N/A"}</td>
                                                        <td>{detail.proejct_day_detail_date || "N/A"}</td>
                                                        <td>{detail.project_day_detail_machine_id__machine_name || "N/A"} {detail.project_day_detail_machine_id__machine_number_plate}</td>
                                                        <td>{detail.project_day_detail_work_type__work_type_name || "N/A"}</td>
                                                        <td>{detail.project_day_detail_total_tyres==='10-Tyres' && (<>10 ટાયર</>)} {detail.project_day_detail_total_tyres==='12-Tyres' && (<>12 ટાયર</>)}</td>
                                                        <td>{detail.project_day_detail_work_no || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_price || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_total_price || "N/A"}</td>
                                                    </tr>
                                                ))
                                            )}
                                            <tr>
                                                <td colSpan="7">
                                                    <span className="font-bold text-base text-green-800">
                                                        કુલ રકમ :{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectDayDetailsTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)}

                    {showProjectMachine && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">મશીન ખર્ચ</div>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ક્રમ</th>
                                                    <th>તારીખ</th>
                                                    <th>મશીન નામ</th>
                                                    <th>કામ પ્રકાર</th>
                                                    <th>કામ</th>
                                                    <th>ભાવ</th>
                                                    <th>કુલ ભાવ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projectMachineData.length > 0 && (
                                                    projectMachineData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>
                                                            <td>{detail.project_machine_date || 'N/A'}</td>
                                                            <td>{detail.machine_project_id__machine_name || 'N/A'} {detail.machine_project_id__machine_number_plate}</td>
                                                            <td>{detail.work_type_id__work_type_name || 'N/A'}</td>
                                                            <td>{detail.project_machine_data_work_number || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_work_price || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_total_amount || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-red-800">
                                                            કુલ ખર્ચ:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {totalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}


                        {showProjectMachineMaintenance && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">મશીન મરામત</div>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ક્રમ</th>
                                                    <th>મશીન નામ</th>
                                                    <th>મરામત પ્રકાર</th>
                                                    <th>રકમ</th>
                                                    <th>તારીખ</th>
                                                    <th>ખર્ચ કરનાર</th>
                                                    <th>સમારકામ કરનાર</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MachineMaintenanceData.length > 0 && (
                                                    MachineMaintenanceData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>
                                                            <td>{detail.machine_machine_id__machine_name || 'N/A'} {detail.machine_machine_id__machine_number_plate || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_types_id__maintenance_type_name || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.machine_maintenance_amount || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_date || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_amount_paid_by || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_person_id__person_name || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-red-800">
                                                            કુલ મરામત ખર્ચ:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {MachineMaintenanceTotalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}



                        {showProjectMaterial && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">પ્રોજેક્ટ મટિરિયલ</div>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ક્રમ</th>
                                                    <th>તારીખ</th>
                                                    <th>મટિરિયલ પ્રકાર</th>
                                                    <th>મટિરિયલ માલિક</th>
                                                    <th>કામ પ્રકાર</th>
                                                    <th>કામ</th>
                                                    <th>ભાવ</th>
                                                    <th>કુલ ભાવ</th>
                                                    <th>મટિરિયલ વિગત</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ProjectMaterialData.length > 0 && (
                                                    ProjectMaterialData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>

                                                            <td>{detail.project_material_date || 'N/A'}</td>
                                                            <td>{detail.project_material_material_type_id__material_type_name || 'N/A'}</td>
                                                            <td>{detail.project_material_material_id__material_owner__person_name || 'N/A'}</td>
                                                            <td>{detail.project_material_work_type_id__work_type_name || 'N/A'}</td>
                                                            <td>{detail.project_material_work_no || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_material_price || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_material_total_amount || 'N/A'}</td>
                                                            <td>{detail.person_material_information || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-red-800">
                                                            કુલ મટિરિયલ ખર્ચ:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {ProjectMaterialTotalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}

                    

                    {showProjectPerson && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Persons</div>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ક્રમ</th>
                                                <th>તારીખ</th>
                                                <th>વ્યક્તિ</th>
                                                <th>મશીન</th>
                                                <th>કામ પ્રકાર</th>
                                                <th>કામ</th>
                                                <th>ભાવ</th>
                                                <th>ખર્ચ કરનાર</th>
                                                <th>કુલ ભાવ</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProjectPersonData.length > 0 && (
                                                ProjectPersonData.map((detail, index) => (
                                                    <tr key={detail.project_person_id}>
                                                        <td>{index + 1 || "N/A"}</td>
                                                        <td>{detail.project_person_date || "N/A"}</td>
                                                        <td>
                                                            {detail.person_id__person_name || "N/A"}
                                                        </td>
                                                        <td>
                                                            {detail.project_machine_data_id__machine_project_id__machine_name || "N/A"} {detail.project_machine_data_id__machine_project_id__machine_number_plate}
                                                        </td>
                                                        <td>
                                                            {detail.work_type_id__work_type_name || "N/A"}
                                                        </td>
                                                        <td>{detail.project_person_work_num || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_price || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_total_price || "N/A"}</td>
                                                        <td>{detail.project_person_paid_by || "N/A"}</td>
                                                    </tr>
                                                ))
                                            )}

                                            <tr>
                                                <td colSpan="9">
                                                    <span className="font-bold text-base text-red-800">
                                                        કુલ વ્યક્તિ ખર્ચ:{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectPersonTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)}

                    {showProjectExpense && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">સરેરાસ ખર્ચ</div>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>ક્રમ</th>
                                                <th>ખર્ચ નામ</th>
                                                <th>પ્રોજેક્ટ નામ</th>
                                                <th>તારીખ</th>
                                                <th>રકમ</th>
                                                <th>પેમેન્ટ મોડ</th>
                                                <th>બૅંક</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProjectExpenseData.length > 0 && (
                                                ProjectExpenseData.map((y, index) => (
                                                    <tr key={y.project_expense_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{y.project_expense_name || "N/A"}</td>
                                                        <td>{y.project_id__project_name || "N/A"}</td>
                                                        <td>{y.project_expense_date || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {y.project_expense_amount || "N/A"}</td>
                                                        <td>{y.project_payment_mode || "N/A"}</td>
                                                        <td>{y.bank_id__bank_name || "N/A"}</td>

                                                    </tr>
                                                ))
                                            )}

                                            <tr>
                                                <td colSpan="7">
                                                    <span className="font-bold text-base text-red-800">
                                                        કુલ સરેરાસ ખર્ચ:{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectExpenseTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                    )}


                </div>
                </>
            )}
        </div>





    );
};

export default ProjectReports;
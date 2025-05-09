import React, { useContext, useEffect, useState } from 'react';
import { del, get } from '../services/api';
import { MdOutlineModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import ModalBar from '../components/EmployeeModal';
import { AuthContext } from '../context/AuthContent';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { modal, setModal } = useContext(AuthContext);

  useEffect(() => {
    get("/employees")
      .then((res) => setEmployees(res.data.data))
      .catch((err) => console.error("Employee Fetch Error:", err));
  }, []);

  console.log(employees)

  const addEmployeeToState = (newEmp) => setEmployees(prev => [...prev, newEmp]);
  const updateEmployeeInState = (updatedEmp) =>
    setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await del(`/employees/${id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      console.error("Employee Deletion Error:", err);
    }
  };

  return (
    <div className='p-8'>
      {modal && (
        <ModalBar
          isEditMode={isEditMode}
          editData={selectedEmployee}
          onClose={() => {
            setModal(false);
            setSelectedEmployee(null);
            setIsEditMode(false);
          }}
          onEmployeeUpdate={(employee) => {
            if (isEditMode) updateEmployeeInState(employee);
            else addEmployeeToState(employee);
          }}
        />
      )}
      <h1 className='text-3xl font-semibold uppercase'>Employees</h1>
      <div
        className='cursor-pointer flex justify-between items-center gap-4 mt-12 p-3 bg-[#2979FF] text-white border border-blue-100 w-fit rounded-md'
        onClick={() => {
          setSelectedEmployee(null);
          setIsEditMode(false);
          setModal(true);
        }}
      >
        <IoMdAdd className='text-xl font-semibold' />
        <h3 className='text-base font-medium'>Add Employee</h3>
      </div>
      <table className='mt-12 w-full'>
        <thead>
          <tr className='text-left bg-blue-50 rounded-sm'>
            <th className='p-3 border'>ID</th>
            <th className='p-3 border'>Name</th>
            <th className='p-3 border'>Phone</th>
            <th className='p-3 border'>Email</th>
            <th className='p-3 border'>Department</th>
            <th className='p-3 border'>Position</th>
            <th className='p-3 border text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? employees.map((emp, index) => (
            <tr key={index} className='space-y-2 border'>
              <td className='p-3 border'>{emp.id}</td>
              <td className='p-3 border'>{emp.first_name} {emp.last_name}</td>
              <td className='p-3 border'>{emp.phone}</td>
              <td className='p-3 border'>{emp.email}</td>
              <td className='p-3 border'>{emp.department}</td>
              <td className='p-3 border'>{emp.position}</td>
              <td className='p-1 flex justify-center items-center gap-4 h-8'>
                <MdOutlineModeEditOutline
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setIsEditMode(true);
                    setModal(true);
                  }}
                  className='text-4xl text-white bg-green-500 p-1.5 rounded-md cursor-pointer'
                />
                <MdDeleteOutline
                  onClick={() => handleDelete(emp.id)}
                  className='text-4xl text-white bg-red-500 p-1.5 rounded-md cursor-pointer'
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
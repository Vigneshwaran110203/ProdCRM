import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContent';
import { post, put } from '../services/api';

const EmployeeModal = ({ isEditMode, editData, onClose, onEmployeeUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const { modal, setModal } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        firstName: editData.first_name || '',
        lastName: editData.last_name || '',
        phone: editData.phone || '',
        email: editData.email || '',
        department: editData.department || '',
        position: editData.position || ''
      });
    }
  }, [isEditMode, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      department: formData.department,
      position: formData.position
    };

    try {
      if (isEditMode && editData?.id) {
        await put(`/employees/${editData.id}`, payload);
        onEmployeeUpdate({ ...payload, id: editData.id });
      } else {
        const res = await post("/employees", payload);
        const newEmp = res.data.data;
        onEmployeeUpdate(newEmp);
      }
      setModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        department: '',
        position: ''
      });
    } catch (err) {
      console.error("Employee submit failed:", err);
    }
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gray-900/50 absolute top-0 left-0'>
      <div className='w-1/4 bg-white rounded p-5'>
        <h3 className='text-xl font-semibold'>{isEditMode ? "Edit Employee" : "Add Employee"}</h3>
        <form onSubmit={handleSubmit} className='space-y-5 mt-8'>
          <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
              <div className='flex flex-col gap-2'>
                <label>Position</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} className='p-2 bg-blue-50 border' />
              </div>
          </div>
          <div className='grid grid-cols-2 gap-4 pt-4'>
            <button type="submit" className='p-2 bg-green-500 text-white rounded-md'>Save</button>
            <button onClick={(e) => { e.preventDefault(); onClose(); }} className='p-2 bg-red-500 text-white rounded-md'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
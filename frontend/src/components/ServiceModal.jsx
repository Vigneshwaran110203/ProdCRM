import React, { useContext, useEffect, useState } from 'react';
import { post, put } from '../services/api';
import { AuthContext } from '../context/AuthContent';

const ModalBar = ({ isEditMode, editData, onClose, onServiceUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const { modal, setModal } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        price: editData.price || ''
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
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price)
    };

    try {
      if (isEditMode && editData?.id) {
        await put(`/services/${editData.id}`, payload);
        onServiceUpdate({ ...payload, id: editData.id });
      } else {
        const res = await post("/services", payload);
        onServiceUpdate(res.data.data);
      }
      setFormData({ name: '', description: '', price: '' });
      setModal(false);
    } catch (err) {
      console.error("Failed to submit service:", err);
    }
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gray-900/50 absolute top-0 left-0'>
      <div className='w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/4 bg-white rounded p-5'>
        <h3 className='text-xl font-semibold'>{isEditMode ? "Edit Service" : "Add Service"}</h3>
        <form onSubmit={handleSubmit} className='space-y-5 mt-8'>
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Name</label>
            <input type="text" name='name' value={formData.name} onChange={handleChange}
              className='bg-blue-50 text-gray-700 p-2 border border-blue-100 rounded' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Description</label>
            <textarea name='description' value={formData.description} onChange={handleChange}
              className='bg-blue-50 text-gray-700 p-2 border border-blue-100 rounded' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-medium'>Price</label>
            <input type="number" name='price' value={formData.price} onChange={handleChange}
              className='bg-blue-50 text-gray-700 p-2 border border-blue-100 rounded' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <button type='submit' className='p-2 bg-green-500 text-white rounded-md'>Submit</button>
            <button onClick={(e) => { e.preventDefault(); onClose(); }} className='p-2 bg-red-500 text-white rounded-md'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalBar;

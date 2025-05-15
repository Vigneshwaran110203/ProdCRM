import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContent';
import { post, put } from '../services/api';

const ProductModal = ({ isEditMode, editData, onClose, onProductUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const { modal, setModal } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantityAvailable: '',
  });

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        price: editData.price || '',
        quantityAvailable: editData.quantity_available || '',
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
      price: parseFloat(formData.price),
      quantity_available: parseInt(formData.quantityAvailable),
    };

    try {
      if (isEditMode && editData?.id) {
        await put(`/products/${editData.id}`, payload);
        onProductUpdate({ ...payload, id: editData.id });
      } else {
        const res = await post("/products", payload);
        const newProd = res.data.data;
        onProductUpdate(newProd);
      }
      setModal(false);
      setFormData({ name: '', description: '', price: '', quantityAvailable: '' });
    } catch (err) {
      console.error("Product submit failed:", err);
    }
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gray-900/50 absolute top-0 left-0'>
      <div className='w-11/12 md:w-8/12 lg:w-1/2 xl:w-1/4 bg-white rounded p-5'>
        <h3 className='text-xl font-semibold'>{isEditMode ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit} className='space-y-5 mt-8'>
          <div className='flex flex-col gap-2'>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className='p-2 bg-blue-50 border' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className='p-2 bg-blue-50 border' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className='p-2 bg-blue-50 border' />
          </div>
          <div className='flex flex-col gap-2'>
            <label>Quantity</label>
            <input type="number" name="quantityAvailable" value={formData.quantityAvailable} onChange={handleChange} className='p-2 bg-blue-50 border' />
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

export default ProductModal;
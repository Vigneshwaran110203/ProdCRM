import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContent'
import { post, put } from '../services/api'

const ModalBar = ({ isEditMode, editData, onClose, onCustomerUpdate }) => {

  const { modal, setModal } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  })

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        firstName: editData.first_name || '',
        lastName: editData.last_name || '',
        phone: editData.phone_number || '',
        email: editData.email || '',
        address: editData.address || '',
        city: editData.city || '',
        state: editData.state || '',
        country: editData.country || '',
        postalCode: editData.postal_code || ''
      })
    }
  }, [isEditMode, editData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = { 
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postalCode
    }

    try{
        if (isEditMode && editData?.id){
            await put(`/customers/${editData.id}`, payload)
            onCustomerUpdate({ ...payload, id: editData.id }) // Push updated data back to parent
        }
        else{
            const res = await post("/customers", payload)
            const newCustomer = res.data.data
            onCustomerUpdate(newCustomer)
        }
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
        })
        setModal(!modal)
    }
    catch (err){
        console.error("Failed to Submit : ", err)
    }
  }

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-gray-900/50 absolute top-0 left-0'>
        <div className='w-1/4 bg-white rounded p-5'>
            <h3 className='text-xl font-semibold'>Add Customers</h3>
            <form onSubmit={handleSubmit} className='space-y-5 mt-8'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="first_name" className='font-medium'>First Name</label>
                        <input 
                            type="text"
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="last_name" className='font-medium'>Last Name</label>
                        <input 
                            type="text"
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="first_name" className='font-medium'>Phone No.</label>
                        <input 
                            type="tel"
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="last_name" className='font-medium'>Email Id</label>
                        <input 
                            type="email" 
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                </div>
                <div className='flex flex-col justify-start items-start gap-2'>
                    <label htmlFor="last_name" className='font-medium'>Address</label>
                    <input 
                        type="text"
                        name='address'
                        value={formData.address}
                        onChange={handleChange} 
                        className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="first_name" className='font-medium'>City</label>
                        <input 
                            type="text"
                            name='city'
                            value={formData.city}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="last_name" className='font-medium'>State</label>
                        <input 
                            type="text" 
                            name='state'
                            value={formData.state}
                            onChange={handleChange}
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="first_name" className='font-medium'>Country</label>
                        <input 
                            type="text"
                            name='country'
                            value={formData.country}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                    <div className='flex flex-col justify-start items-start gap-2'>
                        <label htmlFor="last_name" className='font-medium'>Postal Code</label>
                        <input 
                            type="number"
                            name='postalCode'
                            value={formData.postalCode}
                            onChange={handleChange} 
                            className='w-full bg-blue-50 text-gray-700 p-2 border border-blue-50 rounded text-base'/>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <button type='submit' className='p-2 bg-green-500 text-white rounded-md'>Add</button>
                    <button onClick={(e) => { e.preventDefault(); onClose(); }} className='p-2 bg-red-500 text-white rounded-md'>Cancel</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ModalBar
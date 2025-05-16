import React, { useContext, useEffect, useState } from 'react'
import { del, get } from '../services/api'
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import ModalBar from '../components/ModalBar';
import { AuthContext } from '../context/AuthContent';

const Customers = () => {

  const [customers, setCustomers] = useState({})
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const { modal, setModal } = useContext(AuthContext)

  useEffect(()=>{
    get("/customers").then((res)=>setCustomers(res.data.data)).catch((err)=>console.error("Customer Fetch Error :", err))
  }, [])

  const addCustomerToState = (newCustomer) => {
    setCustomers(prev => [...prev, newCustomer])
  }

  const updateCustomerInState = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c))
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return
  
    try {
      await del(`/customers/${id}`)
      setCustomers((prev) => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error("Customer Deletion Error:", err)
    }
  }

  console.log(customers)

  return (
    <div className='p-8 overflow-x-auto'>
        {modal && (
          <ModalBar
            isEditMode={isEditMode}
            editData={selectedCustomer}
            onClose={() => {
              setModal(false)
              setSelectedCustomer(null)
              setIsEditMode(false)
            }}
            onCustomerUpdate={(customer) => {
              if (isEditMode) {
                updateCustomerInState(customer)
              } else {
                addCustomerToState(customer)
              }
            }}
          />
        )}
        <h1 className='text-3xl font-semibold uppercase'>Customers</h1>
        <div 
          className='cursor-pointer flex justify-between items-center gap-4 mt-12 p-3 bg-[#2979FF] text-white border border-blue-100 w-fit rounded-md'
          onClick={() => {
            setSelectedCustomer(null)
            setIsEditMode(false)
            setModal(true)
          }}
        >
          <IoMdAdd className='text-xl font-semibold'/>
          <h3 className='text-base font-medium'>Add Customers</h3>
        </div>
        <table className='mt-12 w-full'>
          <thead>
            <tr className='text-left bg-blue-50 rounded-sm'>
              <th className='p-3 border border-blue-100'>ID</th>
              <th className='p-3 border border-blue-100'>Name</th>
              <th className='p-3 border border-blue-100'>Phone No.</th>
              <th className='p-3 border border-blue-100'>Email ID</th>
              <th className='p-3 border border-blue-100'>City</th>
              <th className='p-3 border border-blue-100'>State</th>
              <th className='p-3 border border-blue-100'>Country</th>
              <th className='p-3 border border-blue-100 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers && customers.length > 0 ? 
             (customers.map((customer, index) => {
              return(
                <tr key={index} className='space-y-2 border'>
                  <td className='p-3 border'>{customer.id}</td>
                  <td className='p-3 border'>{customer.first_name} {customer.last_name}</td>
                  <td className='p-3 border'>{customer.phone_number}</td>
                  <td className='p-3 border'>{customer.email}</td>
                  <td className='p-3 border'>{customer.city}</td>
                  <td className='p-3 border'>{customer.state}</td>
                  <td className='p-3 border'>{customer.country}</td>
                  <td className='p-1 flex justify-center items-center gap-4 h-8'>
                    <MdOutlineModeEditOutline 
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setIsEditMode(true)
                        setModal(true)
                      }}
                      className='text-4xl text-white bg-green-500 p-1.5 rounded-md cursor-pointer' /> 
                    <MdDeleteOutline
                      onClick={() => handleDelete(customer.id)} 
                      className='text-4xl text-white bg-red-500 p-1.5 rounded-md cursor-pointer' />
                  </td>
                </tr>
              )
            })):(
              <tr>
              <td colSpan={8} className="text-center">No customers found</td>
            </tr>
            )}
          </tbody>
        </table>
    </div>
  )
}

export default Customers
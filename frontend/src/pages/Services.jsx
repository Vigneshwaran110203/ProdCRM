import React, { useContext, useEffect, useState } from 'react';
import { get, del } from '../services/api';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineModeEditOutline, MdDeleteOutline } from "react-icons/md";
import ModalBar from '../components/ServiceModal';
import { AuthContext } from '../context/AuthContent';

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { modal, setModal } = useContext(AuthContext);

  useEffect(() => {
    get("/services")
      .then(res => setServices(res.data.data))
      .catch(err => console.error("Service Fetch Error:", err));
  }, []);

  const addServiceToState = (newService) => {
    setServices(prev => [...prev, newService]);
  };

  const updateServiceInState = (updatedService) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await del(`/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Service Deletion Error:", err);
    }
  };

  return (
    <div className='p-8'>
      {modal && (
        <ModalBar
          isEditMode={isEditMode}
          editData={selectedService}
          onClose={() => {
            setModal(false);
            setSelectedService(null);
            setIsEditMode(false);
          }}
          onServiceUpdate={(service) => {
            isEditMode ? updateServiceInState(service) : addServiceToState(service);
          }}
        />
      )}
      <h1 className='text-3xl font-semibold uppercase'>Services</h1>
      <div 
        className='cursor-pointer flex justify-between items-center gap-4 mt-12 p-3 bg-[#2979FF] text-white border border-blue-100 w-fit rounded-md'
        onClick={() => {
          setSelectedService(null);
          setIsEditMode(false);
          setModal(true);
        }}
      >
        <IoMdAdd className='text-xl font-semibold'/>
        <h3 className='text-base font-medium'>Add Service</h3>
      </div>
      <table className='mt-12 w-full'>
        <thead>
          <tr className='text-left bg-blue-50'>
            <th className='p-3 border border-blue-100'>ID</th>
            <th className='p-3 border border-blue-100'>Name</th>
            <th className='p-3 border border-blue-100'>Description</th>
            <th className='p-3 border border-blue-100'>Price</th>
            <th className='p-3 border border-blue-100 text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? services.map((service, index) => (
            <tr key={index} className='border'>
              <td className='p-3 border'>{service.id}</td>
              <td className='p-3 border'>{service.name}</td>
              <td className='p-3 border'>{service.description}</td>
              <td className='p-3 border'>₹{service.price}</td>
              <td className='p-1 flex justify-center items-center gap-4 mt-0.5'>
                <MdOutlineModeEditOutline
                  onClick={() => {
                    setSelectedService(service);
                    setIsEditMode(true);
                    setModal(true);
                  }}
                  className='text-4xl text-white bg-green-500 p-1.5 rounded-md cursor-pointer' />
                <MdDeleteOutline
                  onClick={() => handleDelete(service.id)}
                  className='text-4xl text-white bg-red-500 p-1.5 rounded-md cursor-pointer' />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="text-center">No services found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Services;

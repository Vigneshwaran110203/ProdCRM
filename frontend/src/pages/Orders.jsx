import React, { useState, useEffect } from 'react';
import { del, get, post, put } from '../services/api';
import { MdDeleteOutline, MdOutlineModeEditOutline } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    employee_id: '',
    status: 'pending',
    products: [{ product_id: '', quantity: 1 }],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchEmployees();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const res = await get('/orders');
    setOrders(res.data.data);
  };

  const fetchCustomers = async () => {
    const res = await get('/customers');
    setCustomers(res.data.data);
  };

  const fetchEmployees = async () => {
    const res = await get('/employees');
    setEmployees(res.data.data);
  };

  const fetchProducts = async () => {
    const res = await get('/products');
    setProducts(res.data.data);
  };

  console.log("Customer", customers)
  console.log("Employees", employees)
  console.log("Products", products)

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product_id: '', quantity: 1 }],
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index][field] = field === 'product_id' ? Number(value) : value;
    setNewOrder({ ...newOrder, products: updatedProducts });
  };  

  const handleEdit = (order) => {
    setIsEditing(true);
    setEditingOrderId(order.id);
    setNewOrder({
      customer_id: order.customer_id,
      employee_id: order.employee_id,
      status: order.status,
      products: order.products.map(p => ({ ...p })),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await del(`/orders/${id}`);
        fetchOrders();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && editingOrderId !== null) {
        await put(`/orders/${editingOrderId}`, newOrder); // You should use PUT or PATCH if your backend supports it
      } else {
        await post('/orders', newOrder);
      }
      fetchOrders();
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };
  
  const resetForm = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditingOrderId(null);
    setNewOrder({
      customer_id: '',
      employee_id: '',
      status: 'pending',
      products: [{ product_id: '', quantity: 1 }],
    });
  };

  return (
    <div className="p-8">
      <h1 className='text-3xl font-semibold uppercase'>order Management</h1>
      <button className="cursor-pointer flex justify-between items-center gap-4 mt-12 p-3 bg-[#2979FF] text-white border border-blue-100 w-fit rounded-md" onClick={() => setModalOpen(true)}>
        <IoMdAdd className='text-xl font-semibold' />
        <p className='text-base font-medium'>New Order</p>
      </button>

      <table className='mt-12 w-full'>
        <thead>
          <tr className='text-left bg-blue-50 rounded-sm'>
            <th className='p-3 border'>ID</th>
            <th className='p-3 border'>Customer ID</th>
            <th className='p-3 border'>Employee ID</th>
            <th className='p-3 border'>Status</th>
            <th className='p-3 border'>Products Name</th>
            <th className='p-3 border'>Quantity</th>
            <th className='p-3 border'>Total Amount</th>
            <th className='p-3 border text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className='space-y-2 border'>
              <td className='p-3 border'>{order.id}</td>
              <td className='p-3 border'>
                {
                  customers.find(c => c.id === order.customer_id)?.first_name ||
                  `ID: ${order.customer_id}`
                }
              </td>
              <td className='p-3 border'>
                {
                  employees.find(e => e.id === order.employee_id)?.first_name ||
                  `ID: ${order.employee_id}`
                }
              </td>
              <td className='p-3 border'>{order.status}</td>
              <td className='p-3 border'>
                {order.products?.map(p => {
                  const product = products.find(prod => prod.id === p.product_id);
                  return (
                    <div key={p.product_id}>
                      {product ? product.name : `Product ID: ${p.product_id}`}
                    </div>
                  );
                })}
              </td>
              <td className='p-3 border'>
                {order.products?.map(p => {
                  return (
                    <div key={p.product_id}>
                      {p.quantity}
                    </div>
                  );
                })}
              </td>
              <td className='p-3 border'>{order.total_amount}</td>
              <td className='p-1 flex justify-center items-center gap-4 pb-2.5'>
                <button
                  onClick={() => handleEdit(order)}
                  className='text-2xl text-white bg-green-500 p-1.5 rounded-md cursor-pointer'
                >
                  <MdOutlineModeEditOutline />
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className='text-2xl text-white bg-red-500 p-1.5 rounded-md cursor-pointer'
                >
                  <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-1/4">
            <h3 className="text-lg font-semibold mb-4">New Order</h3>
            <div className='space-y-4 grid grid-cols-1 gap-4'>
              <select value={newOrder.customer_id} onChange={e => setNewOrder({ ...newOrder, customer_id: Number(e.target.value) })}>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.first_name}</option>)}
              </select>
              <select value={newOrder.employee_id} onChange={e => setNewOrder({ ...newOrder, employee_id: Number(e.target.value) })}>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.first_name}</option>)}
              </select>
              <select value={newOrder.status} onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {newOrder.products.map((p, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <select value={p.product_id} onChange={e => handleProductChange(i, 'product_id', e.target.value)}>
                    <option value="">Select Product</option>
                    {products.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={e => handleProductChange(i, 'quantity', parseInt(e.target.value))}
                    placeholder="Quantity"
                    className="border px-2"
                  />
                </div>
              ))}
            <button className="mr-auto flex items-center gap-2 text-base text-blue-500 mt-2" onClick={handleAddProduct}><IoMdAdd className='text-xl font-semibold' /> Add Product</button>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-4'>
              <button className="p-2 bg-green-500 text-white rounded-md" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="p-2 bg-red-500 text-white rounded-md" onClick={handleSubmit}>Save Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

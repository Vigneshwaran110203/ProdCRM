import React, { useContext, useEffect, useState } from 'react';
import { del, get } from '../services/api';
import { MdOutlineModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import ProductModal from '../components/ProductModal';
import { AuthContext } from '../context/AuthContent';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { modal, setModal } = useContext(AuthContext);

  useEffect(() => {
    get("/products")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error("Product Fetch Error:", err));
  }, []);

  const addProductToState = (newProd) => setProducts(prev => [...prev, newProd]);
  const updateProductInState = (updatedProd) =>
    setProducts(prev => prev.map(prod => prod.id === updatedProd.id ? updatedProd : prod));

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await del(`/products/${id}`);
      setProducts(prev => prev.filter(prod => prod.id !== id));
    } catch (err) {
      console.error("Product Deletion Error:", err);
    }
  };

  return (
    <div className='p-8 overflow-x-auto'>
      {modal && (
        <ProductModal
          isEditMode={isEditMode}
          editData={selectedProduct}
          onClose={() => {
            setModal(false);
            setSelectedProduct(null);
            setIsEditMode(false);
          }}
          onProductUpdate={(product) => {
            if (isEditMode) updateProductInState(product);
            else addProductToState(product);
          }}
        />
      )}

      <h1 className='text-3xl font-semibold uppercase'>Products</h1>
      <div
        className='cursor-pointer flex justify-between items-center gap-4 mt-12 p-3 bg-[#2979FF] text-white border border-blue-100 w-fit rounded-md'
        onClick={() => {
          setSelectedProduct(null);
          setIsEditMode(false);
          setModal(true);
        }}
      >
        <IoMdAdd className='text-xl font-semibold' />
        <h3 className='text-base font-medium'>Add Product</h3>
      </div>

      <table className='mt-12 w-full'>
        <thead>
          <tr className='text-left bg-blue-50 rounded-sm'>
            <th className='p-3 border'>ID</th>
            <th className='p-3 border'>Name</th>
            <th className='p-3 border'>Description</th>
            <th className='p-3 border'>Price</th>
            <th className='p-3 border'>Quantity</th>
            <th className='p-3 border text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? products.map((prod, index) => (
            <tr key={index} className='space-y-2 border'>
              <td className='p-3 border'>{prod.id}</td>
              <td className='p-3 border'>{prod.name}</td>
              <td className='p-3 border'>{prod.description}</td>
              <td className='p-3 border'>{prod.price}</td>
              <td className='p-3 border'>{prod.quantity_available}</td>
              <td className='p-1 flex justify-center items-center gap-4 h-8'>
                <MdOutlineModeEditOutline
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsEditMode(true);
                    setModal(true);
                  }}
                  className='text-4xl text-white bg-green-500 p-1.5 rounded-md cursor-pointer'
                />
                <MdDeleteOutline
                  onClick={() => handleDelete(prod.id)}
                  className='text-4xl text-white bg-red-500 p-1.5 rounded-md cursor-pointer'
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
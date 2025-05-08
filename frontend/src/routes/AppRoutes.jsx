import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Customers from "../pages/Customers"
import Employee from "../pages/Employee"
import Products from "../pages/Products"
import Services from "../pages/Services"
import Orders from "../pages/Orders"
import DashboardHome from "../pages/DashboardHome"
import { useContext } from "react"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import ProtectedRoute from "../routes/ProtectedRoute"
import DashboardPage from "../pages/DashboardPage"
import { AuthContext } from '../context/AuthContent'

const AppRoutes = () => {

  const { auth } = useContext(AuthContext)
  if (auth.loading) return <div>loading..</div>

  return (
    <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employee />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="orders" element={<Orders />} />
          </Route>
    </Routes>
  )
}

export default AppRoutes
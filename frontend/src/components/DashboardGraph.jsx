// src/components/DashboardGraph.jsx
import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer,
    Legend,
  } from "recharts"
  
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]
  
  export const RevenueChart = ({ data }) => (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
  
  export const CustomerGrowthChart = ({ data }) => (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Customer Growth</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
  
  export const OrderStatusChart = ({ data }) => (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Orders by Status</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
  
  export const TopProductsChart = ({ data }) => (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
  
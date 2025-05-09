import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContent"
import AppRoutes from "./routes/AppRoutes"

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
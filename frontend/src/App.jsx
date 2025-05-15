import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContent"
import AppRoutes from "./routes/AppRoutes"
import { GoogleOAuthProvider } from '@react-oauth/google'

const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <GoogleOAuthProvider clientId="601919123717-sro08qeru47n147ipmm9lpsj40b1g347.apps.googleusercontent.com">
          <AppRoutes />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import './App.css'



import { AuthProvider } from './context/Auth'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import { UserProvider } from './context/UserContext'



function App() {
  return (
    <AuthProvider>
      <UserProvider>
       <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  )
   
}

export default App

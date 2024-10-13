
import './App.css'



import { AuthProvider } from './context/Auth'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'



function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
   
}

export default App

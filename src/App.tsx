import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/SignIn/Login'
import Home from './pages/Home/Home'
import {
  QueryClientProvider
} from '@tanstack/react-query'
import { queryClient } from './config/QueryClient'
import EventsPage from './pages/Events/Events'
import CreateEvent from './pages/Events/create/CreateEvent'

export default function App() {



  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/create" element={<CreateEvent />} />
      </Routes>
    </QueryClientProvider>

  )
}



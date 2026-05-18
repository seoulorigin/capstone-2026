import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Monitoring from "@/pages/Monitoring"
import ComposeEditor from "@/pages/ComposeEditor"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/compose-editor" element={<ComposeEditor />} />
      </Routes>
    </BrowserRouter>
  )
}
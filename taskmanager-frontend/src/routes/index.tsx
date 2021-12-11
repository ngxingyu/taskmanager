import { Login } from "@mui/icons-material"
import Projects from "components/Projects"
import ProtectedRoute from "components/ProtectedRoute"
import SignUp from "components/SignUp"
import { Route, Routes } from "react-router-dom"


const routes = (
    <div>
        <Routes>
            <Route index element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/projects" element={
                <ProtectedRoute><Projects /></ProtectedRoute>
            } />
        </Routes>
    </div>
)

export default routes
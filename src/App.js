import SignUpPage from "./components/SignUpPage"
import LoginPage from "./components/LoginPage"
import Home from "./components/Home"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import "./styles/style.css"

const App = () => {
    const { loggedUser } = useContext(AuthContext)
    const ProtectedRoute = ({ children }) => {
        if (!loggedUser) {
            return (
                <Navigate to="/login" />
            )
        }

        return (
            children
        )
    }

    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }>
                    </Route>
                    <Route path="/signup" element={<SignUpPage />}></Route>
                    <Route path="/login" element={<LoginPage />}></Route>
                </Route>
            </Routes>
        </Router>
    )
}


export default App

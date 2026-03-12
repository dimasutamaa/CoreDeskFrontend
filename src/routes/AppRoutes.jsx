import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardLayout from "../pages/layout/DashboardLayout";
import Login from "../pages/Login";
import CreateTicket from "../pages/user/CreateTicket";
import TicketList from "../components/TicketList";
import TicketDetail from "../components/TicketDetail";

export default function AppRoutes() {
    const { user } = useAuth();

    const homePage = user?.role === "ADMIN" ? "/admin" : "/dashboard";

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={user ? <Navigate to={homePage} /> : <Login />} />

            {/* User routes */}
            <Route 
                path="/dashboard" 
                element={
                    !user ? <Navigate to="/login" /> :
                    user.role !== "USER" ? <Navigate to={homePage} /> :
                    <DashboardLayout role="USER" pageTitle="Overview" />
                }>
                <Route index element={<UserDashboard />} />
                <Route path="tickets" element={<TicketList />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route path="tickets/create" element={<CreateTicket />} />
            </Route>

            {/* Admin routes */}
            <Route
                path="/admin"
                element={
                    !user ? <Navigate to="/login" /> :
                    user.role !== "ADMIN" ? <Navigate to={homePage} /> :
                    <DashboardLayout role="ADMIN" pageTitle="Overview" />
                }>
                <Route index element={<AdminDashboard />} />
                <Route path="tickets" element={<TicketList />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? homePage : "/login"} />} />

        </Routes>
    );
}

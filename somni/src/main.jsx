import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './utilities/components/auth-context';
import Login from './pages/login/login';
import Dashboard from './pages/dashboad/dashboard';
import Insights from './pages/hints/insights';
import WeeklyTrends from './pages/trends/weekly-trends/weekly-trends';
import MonthlyTrends from './pages/trends/monthly-trends/monthly-trends';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/weekly-trends" element={<WeeklyTrends />} />
                    <Route path="/monthly-trends" element={<MonthlyTrends />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);

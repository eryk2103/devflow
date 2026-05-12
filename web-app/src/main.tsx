
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router';
import ProjectsPage from './project/ProjectsPage';
import AppLayout from './core/AppLayout';
import NewProjectPage from './project/NewProjectPage';
import LoginPage from './auth/LoginPage';
import ProjectDetailPage from './project/ProjectDetailPage';
import TaskDetailPage from './task/TaskDetailPage';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './core/ProtectedRoute';
import BasicLayout from './core/BasicLayout';
import NewTaskPage from './task/NewTaskPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<BasicLayout />}>
              <Route path="login" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<ProjectsPage />} />
              <Route path="project/new" element={<NewProjectPage />} />
              <Route path="project/:id" element={<ProjectDetailPage />} />
              <Route path="project/:projectId/task/new" element={<NewTaskPage />} />
              <Route path="project/:projectId/task/:taskId" element={<TaskDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

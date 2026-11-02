import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { VisitorProvider } from './context/VisitorContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingAssistant from './components/common/FloatingAssistant'
import SEOManager from './components/seo/SEOManager'
import SupabaseStatus from './components/SupabaseStatus'

const Home = lazy(() => import('./pages/Home'))
const TrainingCalendar = lazy(() => import('./pages/TrainingCalendar'))
const TrainingCategories = lazy(() => import('./pages/TrainingCategories'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const TrainingVenues = lazy(() => import('./pages/TrainingVenues'))
const TrainingFormats = lazy(() => import('./pages/TrainingFormats'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQs = lazy(() => import('./pages/FAQs'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Enrollment = lazy(() => import('./pages/Enrollment'))
const TrainerRecruitment = lazy(() => import('./pages/TrainerRecruitment'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-teal-dark/20 border-t-navy rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    </div>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOManager />
      <Navbar />
      <main className="flex-1">
        <ScrollRestoration />
        <Outlet />
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  )
}

function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'training-calendar', element: <TrainingCalendar /> },
        { path: 'training-categories', element: <TrainingCategories /> },
        { path: 'training-categories/:slug', element: <CategoryDetail /> },
        { path: 'training-categories/:slug/:subslug', element: <CategoryDetail /> },
        { path: 'course/:slug', element: <CourseDetail /> },
        { path: 'training-venues', element: <TrainingVenues /> },
        { path: 'training-formats', element: <TrainingFormats /> },
        { path: 'about', element: <AboutUs /> },
        { path: 'contact', element: <Contact /> },
        { path: 'faqs', element: <FAQs /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blog/:slug', element: <BlogPost /> },
        { path: 'enroll/:courseId', element: <Enrollment /> },
        { path: 'trainer-recruitment', element: <TrainerRecruitment /> },
        { path: '*', element: <NotFound /> },
      ],
    },
    {
      path: '/login',
      element: <AuthLayout />,
      children: [{ index: true, element: <Login /> }],
    },
    {
      path: '/admin/*',
      element: <AdminDashboard />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
)

export default function App() {
  return (
    <VisitorProvider>
      <SiteProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <SupabaseStatus />
      </SiteProvider>
    </VisitorProvider>
  )
}

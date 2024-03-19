import { Navigate, createBrowserRouter } from "react-router-dom";
import HomeMiddleware from "./components/middleware/home.middleware";
import { AddAdmin, AddFacility, AddReport, AddWorker, Facilities, Home, Login, PageNotFound, Signup } from "./components";
import AuthMiddleware from "./components/middleware/auth.middlewate";
import { AddDoctor } from "./components/forms/addDoctor";
import PatientReports from "./components/report/ReportsSection";

const router = createBrowserRouter([
 {
    path:'/',
    element:<Navigate to={'/home'} replace/>,
    errorElement:<PageNotFound/>
 },
 {
    path:'/home',
    element:<HomeMiddleware/>,
    children:[
        {
            path:'',
            element:<Navigate to={'/home/reports'} replace/>
        },
        {
            path:'info',
            element:<Home/>
        },
        {
            path:'reports',
            element:<PatientReports/>
        },
        {
            path:'report/:id',
            element:<h1>Complete report info here</h1>
        },
        {
            path:'profile',
            element:<h1>Profile page here</h1>
        },
        {
            path:'facilites',
            element:<Facilities/>
        },
        {
            path:'facilites/add',
            element:<AddFacility/>,
        },
        {
            path:'facilites/edit',
            element:<AddFacility/>
        },
        {
            path:'report/edit',
            element:<AddReport/>
        },
        {
            path:'report/add',
            element:<AddReport/>
        },
        {
            path:'doctor/add',
            element:<AddDoctor/>
        },
        {
            path:'worker/add',
            element:<AddWorker/>
        },
        {
            path:'admin/add',
            element:<AddAdmin/>
        }
    ],
 },
 {
    path:'/auth',
    element:<AuthMiddleware/>,
    children:[{
        path:'',
        element:<Login/>
    },
    {
        path:'signup',
        element:<Signup/>
    }
    ]
 }
])

export const routeConfig = {
    login:'/auth',
    signup:'/auth/signup',
    resetPassword:(token:string)=>`/auth/${token}`,
    forgotPassword:(token:string)=>`/auth/${token}`,
    dashboard:'/home',
    reports:'/home/reports',
    facility:'/home/facilites',
    doctors:'/home/doctors',
    report:(id:string|number)=>`/home/report/${id}`,
    addAdmin:'/admin/add',
    addWorker:'admin/worker',
    addReport:'/reports/add',
    viewRequests:'/requests',
    addFacility:(id:string|number)=>`/home/facilites/${id}`,
    editFacility:(id:string|number)=>`home/facilites/${id}`,
    editReport:(id:string|number)=>`/reports/edit/${id}`,
    deleteReport:(id:string|number)=>`/reports/delete/${id}`,
    profilePage:(id:string)=>`/user/${id}`
}

export default router
import { Navigate, createBrowserRouter } from "react-router-dom";
import HomeMiddleware from "./components/middleware/home.middleware";
import { AddAdmin, AddFacility, AddReport, AddWorker, Facilities, Home, Login, PageNotFound, Signup } from "./components";
import AuthMiddleware from "./components/middleware/auth.middlewate";
import ChangeRole from './components/auth/changeRole'
import { AddDoctor } from "./components/forms/addDoctor";
import PatientReports from "./components/ReportsSection";
import  ListDoctors  from "./components/listDoctors";
import AddDetails from "./components/forms/addDetails";
import AddUser from './components/forms/addUser'
import RequestSection from "./components/requests/reportRequests";
import ReportRequest from "./components/requests/reportRequests";
import RequestsMiddleware from "./components/requests/RequestsPage";

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
            element:<Home/>
        },
        {
            path:'reports',
            element:<PatientReports/>
        },
        {
            path:'doctors',
            element:<ListDoctors/>
        },
        {
            path:'addUser',
            element:<AddUser/>
        },
        {
            path:'facilites',
            element:<Facilities/>
        },
        {
            path:'requests',
            element:<RequestsMiddleware/>,
            children:[ 
                {
                    path:'',
                    element:<ReportRequest/>
                },
                {
                    path:'other',
                    element:<ReportRequest/>
                }
            ],
            errorElement:<PageNotFound/>            
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
        },
        {
            path:'requests',
            element:<RequestSection/>
        },
        {
            path:'info',
            element:<Home/>
        },
        {
            path:'facilites/add',
            element:<AddFacility/>,
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
            path:'changeRole',
            element:<ChangeRole/>
        }
    ],
 },
 {
    path:'addDetails/:id',
    element:<AddDetails/>
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
    changeRole:'/auth/changeRole',
    home:'/home',
    reports:'/home/reports',
    facility:'/home/facilites',
    doctors:'/home/doctors',
    addAdmin:'/admin/add',
    addWorker:'/admin/worker',
    addUser:'/home/addUser',
    viewRequests:'/home/requests',
    report:(id:string|number)=>`/home/report/${id}`,
    editFacility:(id:string|number)=>`home/facilites/${id}`,
    editReport:(id:string|number)=>`/reports/edit/${id}`,
    deleteReport:(id:string|number)=>`/reports/delete/${id}`,
    profilePage:(id:string)=>`/user/${id}`
}

export default router
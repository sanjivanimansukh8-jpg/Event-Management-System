import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Events from "./Pages/Events";
import EventDetails from "./Pages/EventDetails";
import Booking from "./Pages/Booking";
import MyBookings from "./Pages/MyBookings";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminDashboard from "./Pages/AdminDashboard";
import AddEvent from "./Pages/AddEvent";
import ManageBookings from "./Pages/ManageBookings";
import ManageEvents from "./Pages/ManageEvents";
import CategoryEvents from "./Pages/CategoryEvents";
import BookingForm from "./Pages/BookingForm";
import EditEvent from "./Pages/EditEvent";
import EditPackage from "./Pages/EditPackage";
import ManagePackages from "./Pages/ManagePackages";
import AddPackage from "./Pages/AddPackage";
import ViewEvents from "./Pages/ViewEvents";
import Payment from "./Pages/Payment";
import BookingSuccess from "./Pages/BookingSuccess";
import ManagePayments from "./Pages/ManagePayments";
import AdminRoute from "./Components/AdminRoute";
import BookingSummary from "./Pages/BookingSummary";
import CustomerDetails from "./Pages/CustomerDetails";
import Inquiry from "./Pages/Inquiry";
import ManageInquiries from "./Pages/ManageInquiries";
import ManageUsers from "./Pages/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />}/>
        <Route path="/booking" element={<Booking />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/admin/add-event" element={<AddEvent />}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/events/category/:category" element={<CategoryEvents/>}/>
        <Route path="/booking-form" element={<BookingForm/>}/>
        <Route path="/my-bookings" element={<MyBookings/>}/>
        <Route path="/admin/manage-bookings" element={<AdminRoute><ManageBookings/></AdminRoute>}/>
        <Route path="/admin/events/edit/:id" element={<EditEvent/>}/>
        <Route path="/admin/events" element={<ManageEvents />}/>
        <Route path="/admin/edit-package/:id" element={<EditPackage />}/>
        <Route path="/admin/manage-packages" element={<AdminRoute><ManagePackages/></AdminRoute>}/>
        <Route path="/admin/add-package" element={<AdminRoute><AddPackage/></AdminRoute>}/>
        <Route path="/view-events" element={<ViewEvents />} />
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/booking-success" element={<BookingSuccess/>}/>
        <Route path="/admin/manage-payments" element={<ManagePayments/>}/>
        <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path="/customer-details" element={<CustomerDetails/>}/>
        <Route path="/booking-summary" element={<BookingSummary/>}/>
        <Route path="/inquiry" element={<Inquiry/>}/>
        <Route path="/admin/manage-inquiries" element={<AdminRoute><ManageInquiries/></AdminRoute>}/>
        <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers/></AdminRoute>}/>
      </Routes>
    <Footer />
    </BrowserRouter>
  );
}

export default App;
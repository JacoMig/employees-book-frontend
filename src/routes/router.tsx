import HelloWorld from "@/app/helloWorld/page";
import { Logout } from "@/app/logout/page";
import {ProfilePage} from "@/app/Profile/page";

import { LoginForm } from "@/components/login-form";
import Navigation from "@/components/Navigation";
import ProfileForm  from "@/components/profileForm";
import { SignUpForm } from "@/components/signUpForm";
/* import { Spinner } from "@/components/ui/spinner";
import { lazy, Suspense } from "react"; */
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// const ProfileForm = lazy(() => import("@/components/profileForm"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <Navigation />
        </>
      }
    >
      <Route path="sign-up" element={<SignUpForm />}></Route>
      <Route path="login" element={<LoginForm />}></Route>
      <Route path="logout" element={<Logout />}></Route>
      <Route path="profile" element={ <ProfilePage/>}></Route>
      <Route path="hello" element={<HelloWorld />}></Route>
    </Route>
  )
);

export default router;

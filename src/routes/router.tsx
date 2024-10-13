import HelloWorld from "@/app/helloWorld/page";
import { Logout } from "@/app/logout/page";

import { LoginForm } from "@/components/login-form";
import Navigation from "@/components/Navigation";
import { ProfileForm } from "@/components/profileForm";
import { SignUpForm } from "@/components/signUpForm";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

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
      <Route path="profile" element={<ProfileForm />}></Route>
      <Route path="hello" element={<HelloWorld />}></Route>
    </Route>
  )
);

export default router;

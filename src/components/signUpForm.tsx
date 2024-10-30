import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import httpUserClient from "@/http/user";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const {register} = httpUserClient()
  // const {login, getUser} = useAuth()
  const navigate = useNavigate()

  const formSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await register(username, email, password)
    navigate('/')
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create a user account</CardTitle>
        <CardDescription>
          Enter your credential to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Pippo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="pippo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" onClick={formSubmit} className="w-full">
            Sign Up
          </Button>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Do you have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

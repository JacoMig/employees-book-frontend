import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/Auth'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type LoginParams = {
    email: string
    password: string
}

export function LoginForm() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { login, user } = useAuth()
    const navigate = useNavigate()
    const {toast} = useToast()

    const loginMutation = useMutation({
        mutationFn: async (params:LoginParams) => {
            await login(params.email, params.password)
        },
        onError: (e) => {
          console.log(e);
          toast({
            title: e.message,
            variant: "destructive"
          })
        },
        onSuccess: async () => {
            toast({
              title: "Logged in successfully",
            })
            navigate('/')
        },
    })

    const formSubmit = async (e: FormEvent) => {
        e.preventDefault()
        loginMutation.mutate({
          email,
          password
        })
    }

    useEffect(() => {
        if(user) {
            navigate('/')
        }
    }, [user])

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email or Username</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
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
                    <Button
                        type="submit"
                        onClick={formSubmit}
                        className="w-full"
                    >
                        Login
                    </Button>
                    {/*  <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <Link to="/sign-up" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

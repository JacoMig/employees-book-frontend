import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { getDecodedToken, setStoredToken, useAuth } from '@/context/Auth'
import { useToast } from '@/hooks/use-toast'
import httpUserClient from '@/http/user'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'

const formSchemaSignUp = z.object({
    username: z
        .string()
        .min(1, {
            message: 'Username must be at least 2 chars long',
        })
        .max(16, {
            message: 'Username must be at most 16 chars long',
        }),
    email: z.string().email(),
    password: z
        .string()
        .min(8, {
            message: 'Password must be at least 8 chars long',
        })
        .max(16, {
            message: 'Password must be at most 16 chars long',
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~_&*%!?@#$])[A-Za-z\d~_&*%!?@#$]+$/,
            {
                message: `Password  must contain letters, numbers, and ~_&*%!?@#$`,
            }
        ),
})

type SignUpParams = {
    username: string
    email: string
    password: string
}

export function SignUpForm() {
    const { register } = httpUserClient()
    const { setToken } = useAuth()

    const navigate = useNavigate()
    const { toast } = useToast()

    const signUpMutation = useMutation({
        mutationFn: async (params: SignUpParams) => {
            return await register(
                params.username,
                params.email,
                params.password
            )
        },
        onError: (e) => {
            toast({
                title: 'Error while signing up',
                description: e.message,
                variant: 'destructive',
            })
        },
        onSuccess: async (data) => {
            setStoredToken(data.token)
            const t = getDecodedToken()
            setToken(t)

            toast({
                title: 'Signed up successfully',
            })
            navigate('/')
        },
    })

    const formSubmit = async (values: z.infer<typeof formSchemaSignUp>) => {
        const { username, email, password } = values
        signUpMutation.mutate({
            username,
            email,
            password,
        })
    }

    const form = useForm<z.infer<typeof formSchemaSignUp>>({
        resolver: zodResolver(formSchemaSignUp),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Create a user account
                </CardTitle>
                <CardDescription>
                    Enter your credential to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(formSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Pippo"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="pippo@gmail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                            {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Do you have an account?{' '}
                            <Link to="/login" className="underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

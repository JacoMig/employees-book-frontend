import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import httpUserClient from '@/http/user'
import { useCallback, useMemo } from 'react'
import httpUploadsClient from '@/http/uploads'
import { TrashIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DatePicker } from './DatePicker'
import { IUser, PatchUser } from '@/models/dtos'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDirtyFieldsValues } from '@/lib/utils'
import { ImageCropContainer } from './ImageCropContainer'
import { Spinner } from './ui/spinner'
import { useToast } from '@/hooks/use-toast'

export const formSchema = z.object({
    username: z
        .string()
        .min(1, {
            message: 'Username must be at least 2 chars long',
        })
        .max(20, {
            message: 'Username must be at most 16 chars long',
        }),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cvUrl: z
        .union([
            z.instanceof(File).refine((file) => file.size < 7000000, {
                message: 'Your resume must be less than 7MB.',
            }),
            z.string(),
        ])
        .optional(),
    hiringDate: z.optional(z.string()),
    profileImage: z.optional(
        z.string()
    ),
})

type MutationParams = {
    id: string
    params?: PatchUser
    formData?: FormData
    remove?: {
        filename: string
        removeKey: 'cvUrl' | 'profileImage'
    }
}

const ProfileForm = ({ user }: { user: IUser }) => {
    const { patch } = httpUserClient()
    const { update, remove } = httpUploadsClient()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            jobTitle: user.jobTitle || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            cvUrl: user.cvUrl || '',
            hiringDate: user.hiringDate || '',
            profileImage: user.profileImage || '',
        },
    })
    console.log(user);
    const patchMutation = useMutation({
        mutationFn: async (params: MutationParams) => {
            if (params.formData) await update(params.id, params.formData!)
            if (params.params) await patch(params.id, params.params)
            if (params.remove)
                await remove({
                    id: params.id,
                    filename: params.remove.filename!,
                    removeKey: params.remove.removeKey,
                })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['getUser'],
            })

            toast({
                title: 'User updated successfully!',
            })
        },
        onError: (e) => {
            toast({
                title: 'Error while updating user',
                description: e.message,
                variant: 'destructive',
            })
        },
    })

    const userId = user.id

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!Object.keys(form.formState.dirtyFields).length) return

        const dirtyValues = getDirtyFieldsValues(
            form.formState.dirtyFields,
            values
        )

        let formData: FormData | undefined = undefined
        if (dirtyValues.cvUrl) {
            formData = new FormData()
            formData.append('files', dirtyValues.cvUrl)
        }

        if (dirtyValues.profileImage) {
            if(!formData) 
                formData = new FormData()
            formData.append('profileImage', dirtyValues.profileImage)
        }

        delete dirtyValues.cvUrl
        delete dirtyValues.profileImage

        patchMutation.mutate({
            id: userId,
            params: Object.keys(dirtyValues).length ? dirtyValues : undefined,
            formData,
        })
    }

    const cvFileName = useMemo(() => {
        if (!user.cvUrl) return ''
        return decodeURI(user.cvUrl.split('/').pop()!)
    }, [user.cvUrl])

    const uploadFile = useCallback(
        async (file: Blob | string) => {
            const formData: FormData | undefined = new FormData()
            formData.append('files', file)
            
            patchMutation.mutate(
                {
                    id: userId,
                    formData
                },
                {
                   
                }
            )
        },
        [patchMutation, userId]
    )

    const deleteFile = useCallback(
        async (name: string, removeKey: 'cvUrl' | 'profileImage') => {
            patchMutation.mutate(
                {
                    id: userId,
                    remove: {
                        filename: name,
                        removeKey,
                    },
                },
                {
                    onSuccess: () => {
                        form.resetField('profileImage', {
                            defaultValue: '',
                        })
                    },
                }
            )
        },
        [patchMutation, form, userId]
    )

    if (patchMutation.isPending) return <Spinner></Spinner>

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-3/6 mr-auto ml-auto"
            >
                <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field: { onChange, value } }) => (
                        <FormItem>
                            <FormControl>
                                <ImageCropContainer
                                    deleteFile={deleteFile}
                                    imageUrl={value}
                                    onImageChange={(p) => {
                                        onChange(p.image)
                                        uploadFile(p.file)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Pippo"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Maugeri"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job title</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Fullstack developer"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="hiringDate"
                    render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel>Date of hire</FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={value ? new Date(value) : new Date()}
                                    onSetDate={(d) => onChange(d.toString())}
                                />
                            </FormControl>
                            <FormDescription>
                                When have you been hired?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cvUrl"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>Resume</FormLabel>
                            {user?.cvUrl ? (
                                <div className="space-y-2">
                                    <Link to={value as string} target="_blank">
                                        {cvFileName}
                                    </Link>
                                    <Button
                                        type={'button'}
                                        variant="outline"
                                        onClick={() =>
                                            deleteFile(cvFileName, 'cvUrl')
                                        }
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <FormControl>
                                    <Input
                                        onChange={(event) =>
                                            onChange(
                                                event.target.files &&
                                                    event.target.files[0]
                                            )
                                        }
                                        type="file"
                                        accept="application/pdf"
                                        {...fieldProps}
                                    />
                                </FormControl>
                            )}

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Update</Button>
            </form>
        </Form>
    )
}

export default ProfileForm

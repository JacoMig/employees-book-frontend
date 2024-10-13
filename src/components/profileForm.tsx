import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/context/Auth";
import httpUserClient from "@/http/user";
import { useCallback, useMemo } from "react";
import httpUploadsClient from "@/http/uploads";
import { TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { DatePicker } from "./DatePicker";
import { format } from "date-fns"

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username must be at least 2 chars long",
    })
    .max(20, {
      message: "Username must be at most 16 chars long",
    }),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cv: z
    .union([
      z.instanceof(File).refine((file) => file.size < 7000000, {
        message: "Your resume must be less than 7MB.",
      }),
      z.string(),
    ])
    .optional(),
  hiringDate: z.optional(z.string()),
});

const ProfileForm = () => {
  const { patch } = httpUserClient();
  const { update, remove } = httpUploadsClient();
  const { user, getUser } = useAuth();

  const currentUser = user!;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      jobTitle: currentUser.jobTitle || "",
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      cv: currentUser.cvUrl || "",
      hiringDate: currentUser.hiringDate || "",
    },
  });

  const userId = currentUser.id;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await patch(userId, values);
    if (values.cv instanceof File) {
      const formData = new FormData();
      formData.append("files", values.cv);
      await update(userId!, formData);
    }

    await getUser();
  }

  const onSetHiringDate = (date:Date) => {
    form.setValue('hiringDate', date.toISOString())
    console.log('onSetHiringDate', date)
  }

  const filename = useMemo(() => {
    if (!currentUser.cvUrl) return "";
    return currentUser.cvUrl.split("/").pop();
  }, [currentUser.cvUrl]);

  const deleteResume = useCallback(async () => {
    form.reset({
      cv: "",
    });
    await remove(userId, filename!);
    await getUser();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/6 mr-auto ml-auto">
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
                <Input type="text" placeholder="Pippo" {...field} />
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
                <Input type="text" placeholder="Maugeri" {...field} />
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
                <Input type="email" placeholder="pippo@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hiringDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of hire</FormLabel>
              <FormControl>
                <DatePicker date={new Date(field.value!)} onSetDate={onSetHiringDate}/>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cv"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              {user?.cvUrl ? (
                <div className="space-y-2">
                  <Link to={user?.cvUrl} target="_blank">
                    {filename}
                  </Link>
                  <Button
                    type={"button"}
                    variant="outline"
                    onClick={() => deleteResume()}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <FormControl>
                  <Input
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
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
  );
};

export { ProfileForm };

"use client";

import { api } from "@/app/lib/client/api";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import z from "zod/v4";

export default function SignUpPage() {
  const schema = z.object({
    email: z.email(),
    password: z.string(),
  });

  const signUpMutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (data: z.infer<typeof schema>) => {
      const res = await api.user.signup.post(data);

      if (res.error) {
        throw new Error(res.error.value.message);
      }

      return data;
    },
    // onSuccess: async (data) => {
    //   await signIn("credentials", {
    //     ...data,
    //     redirect: false,
    //   });
    // },
    onError: (error) => {
      alert(error.message);
    },
  });

  const form = useForm({
    defaultValues: {} as z.infer<typeof schema>,
    onSubmit: async (values) => {
      await signUpMutation.mutateAsync(values.value);
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 rounded-xl bg-green-200 border border-r-black p-10"
      >
        <form.Field name="email">
          {(field) => (
            <input
              className="bg-green-400 placeholder:text-blue-400"
              placeholder="Type email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <input
              className="bg-green-400 placeholder:text-blue-400"
              placeholder="Type password"
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              className="bg-amber-500 text-white p-2 rounded-xl"
            >
              Sign up
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

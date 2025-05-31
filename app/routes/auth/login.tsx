import type { Route } from "./+types/login";
import { useState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { getInputProps, getFormProps, useForm } from "@conform-to/react";
import { Label } from "~/components/ui/label";
import { EyeOff, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Form, Link, redirect, useActionData } from "react-router";
import { signInSchema } from "~/validations/auth";
import { signIn } from "~/lib/auth.client";
import { toast } from "sonner";
import { z } from "zod";
import { auth } from "~/lib/auth.server";
import { LoginForm } from "~/components/auth/LoginForm";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session) {
    throw redirect("/notes");
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signInSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { error } = await signIn.email({
    ...submission.value,
  });

  if (error) {
    if (error.status === 429) {
      toast.error("Too many login attempts. Please try again in 60 seconds.");
    } else if (error.status === 401) {
      toast.error("Invalid email or password");
    } else {
      toast.error(error.message || "An unexpected error occurred.");
    }
    return null;
  }

  return redirect("/notes");
}

export default function Login() {
  const lastResult = useActionData<typeof clientAction>();
  const [showPassword, setShowPassword] = useState(false);
  const [form, fields] = useForm<z.infer<typeof signInSchema>>({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return <LoginForm />;
}

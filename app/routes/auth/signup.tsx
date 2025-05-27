import { z } from "zod";
import type { Route } from "./+types/signup";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { signUp } from "~/lib/auth.client";
import { signUpSchema } from "~/validations/auth";
import { toast } from "sonner";
import { redirect, Form, Link, useActionData } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signUpSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { error } = await signUp.email({
    ...submission.value,
  });

  error
    ? toast.error(error.message || "An expected error occured.")
    : toast.success("Signed up successfully!");

  return redirect("/login");
}

export default function Signup() {
  const lastResult = useActionData<typeof clientAction>();
  const [form, fields] = useForm<z.infer<typeof signUpSchema>>({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
    },
    constraint: getZodConstraint(signUpSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center text-gray-900">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your details to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form className="space-y-2" method="post" {...getFormProps(form)}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name
            </Label>
            <Input
              {...getInputProps(fields.name, { type: "text" })}
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {fields.name.errors && fields.name.errors.length > 0 && (
              <div id={fields.name.errorId} className="text-red-500 text-sm">
                {fields.name.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </Label>
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {fields.email.errors && fields.email.errors.length > 0 && (
              <div id={fields.email.errorId} className="text-red-500 text-sm">
                {fields.email.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              {...getInputProps(fields.password, { type: "password" })}
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {fields.password.errors && fields.password.errors.length > 0 && (
              <div
                id={fields.password.errorId}
                className="text-red-500 text-sm"
              >
                {fields.password.errors.map((err, i) => (
                  <p key={i}>{err}</p>
                ))}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Create account
          </Button>
        </Form>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

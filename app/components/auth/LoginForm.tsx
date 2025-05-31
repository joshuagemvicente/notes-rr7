import { Form, Link, data, redirect, useActionData } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { EyeOff, Eye } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import type { clientAction } from "~/routes/auth/login";
import { parseWithZod } from "@conform-to/zod";
import { signInSchema } from "~/validations/auth";
import { useState } from "react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const lastResult = useActionData<typeof clientAction>();
  const [form, fields] = useForm({
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
  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center text-gray-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form className="space-y-1" method="post" {...getFormProps(form)}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </Label>
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
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
            <div className="relative">
              <Input
                {...getInputProps(fields.password, { type: "password" })}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
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
          </div>
          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Sign in
          </Button>
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}

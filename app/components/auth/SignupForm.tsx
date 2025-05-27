import { Form } from "react-router";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SignupForm() {
  return (
    <div>
      <Form method="post">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input type="text" name="firstName" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input type="text" name="lastName" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input type="text" name="username" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" />
        </div>
      </Form>
    </div>
  );
}

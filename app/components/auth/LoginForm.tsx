import { Form, data, redirect } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export function LoginForm() {
  return (
    <div>
      <Form method="post">
        <div className="flex flex-col gap-y-1">
          <div className="space-y-1">
            <Label htmlFor="">Username</Label>
            <Input type="text" name="username" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="">Password</Label>
            <Input type="text" name="password" />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}

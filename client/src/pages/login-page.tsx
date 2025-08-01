// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import { login } from "@client/api/login.ts";
import StringFormControl from "@client/components/form-controls/string-form-control.tsx";
import { Button } from "@client/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@client/components/ui/card.tsx";
import { Form } from "@client/components/ui/form.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { MAIN_HEIGHT } from "@client/lib/css-constants.ts";
import { cn } from "@client/lib/utils.ts";
import { useAppDispatch } from "@client/redux/hooks.ts";
import { userAction } from "@client/redux/slices/user-slice.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginFormSchema,
  type LoginFormSchema,
} from "@shared/login-form-schema.ts";
import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const submitBtnRef = React.useRef<null | HTMLButtonElement>(null);

  const navigate = useNavigate();
  const appDispatch = useAppDispatch();

  const { formState, setError, clearErrors } = form;
  const { errors } = formState;

  const errorCount = React.useMemo(
    () => Object.keys(errors).length,
    [formState],
  );

  const handleSubmitClick = () => {
    const { current: submitBtn } = submitBtnRef;

    if (!submitBtn) return;

    submitBtn.click();
  };

  const onSubmit: SubmitHandler<LoginFormSchema> = async formData => {
    const { error, message } = await login(formData);

    if (error) {
      setError("username", { message });
      return;
    }

    clearErrors();
    appDispatch(userAction.setUsername(formData.username));
    void navigate(PAGE_ROUTES.DASHBOARD);
  };

  return (
    <main className={cn("pt-24", MAIN_HEIGHT)}>
      <Card className="main-container max-w-3xl m-auto shadow-none border-0 bg-transparent lg:border lg:bg-card lg:shadow-sm">
        <CardHeader className="p-0">
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <StringFormControl<LoginFormSchema>
                label="Username"
                name="username"
                placeholder="mohsen"
                description="Username must be unique."
              />

              <button
                ref={submitBtnRef}
                className="hidden"
                type="submit"
              />
            </form>
          </Form>
        </CardContent>

        <CardFooter className="p-0">
          <Button
            className="!ml-auto"
            type="submit"
            onClick={handleSubmitClick}
            size="sm"
            disabled={errorCount > 0}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default LoginPage;

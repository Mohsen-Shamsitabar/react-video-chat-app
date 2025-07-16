// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import { login } from "@client/api/login.ts";
import StringFormControl from "@client/components/form-controls/string-form-control.tsx";
import { Button } from "@client/components/ui/button.tsx";
import { Form } from "@client/components/ui/form.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useAppDispatch } from "@client/redux/hooks.ts";
import { loggedUserAction } from "@client/redux/slices/logged-user-slice.ts";
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

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { formState, setError, clearErrors } = form;
  const { errors } = formState;

  const errorCount = React.useMemo(
    () => Object.keys(errors).length,
    [formState],
  );

  const onSubmit: SubmitHandler<LoginFormSchema> = async formData => {
    const { error, message } = await login(formData);

    if (error) {
      setError("username", { message });
      return;
    }

    clearErrors();
    dispatch(loggedUserAction.setUsername(formData.username));
    void navigate(PAGE_ROUTES.CHATROOM);
  };

  return (
    <main className="main-container">
      <div className="container p-6 mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <StringFormControl<LoginFormSchema>
              label="Username"
              name="username"
              placeholder="mohsen"
              description="This value must be unique."
            />

            <div className="flex flex-row-reverse mt-2">
              <Button
                type="submit"
                size="sm"
                disabled={errorCount > 0}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default LoginPage;

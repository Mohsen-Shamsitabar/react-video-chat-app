import StringFormControl from "@client/components/form-controls/string-form-control.tsx";
import { Button } from "@client/components/ui/button.tsx";
import { Form } from "@client/components/ui/form.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newRoomFormSchema,
  type NewRoomFormSchema,
} from "@shared/new-room-form-schema.ts";
import * as React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const NewRoomForm = () => {
  const form = useForm<NewRoomFormSchema>({
    resolver: zodResolver(newRoomFormSchema),
    defaultValues: {
      roomName: "",
      roomSize: 2,
    },
  });

  const navigate = useNavigate();

  const { formState } = form;
  const { errors } = formState;

  const errorCount = React.useMemo(
    () => Object.keys(errors).length,
    [formState],
  );

  const onSubmit: SubmitHandler<NewRoomFormSchema> = formData => {
    console.log(formData);

    const { roomName, roomSize } = formData;

    void navigate(`${PAGE_ROUTES.CHATROOM}/${roomName}`);
  };

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col mt-6 space-y-6"
      >
        <StringFormControl<NewRoomFormSchema>
          label="Room name"
          name="roomName"
          placeholder="chatroom 101"
        />

        <StringFormControl<NewRoomFormSchema>
          label="Room size"
          name="roomSize"
          description="The maximum amount of users who can connect to this room."
          disabled
        />

        <Button
          type="submit"
          disabled={errorCount > 0}
        >
          Create
        </Button>
      </form>
    </Form>
  );
};

export default NewRoomForm;

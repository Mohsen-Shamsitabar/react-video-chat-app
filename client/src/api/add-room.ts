import { API_ROUTES, NETWORK } from "@shared/constants.ts";
import { type NewRoomFormSchema } from "@shared/new-room-form-schema.ts";
import { type AddRoomResponseBody } from "@shared/types.ts";

type AddRoomResult = {
  message: string;
  error: boolean;
};

export const addRoom = async (
  data: NewRoomFormSchema,
): Promise<AddRoomResult> => {
  const res = await fetch(`${NETWORK.SERVER_URL}${API_ROUTES.ADD_ROOM}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = (await res.json()) as AddRoomResponseBody;

  if (!res.ok) {
    return { message: body.message, error: true };
  }

  return { message: body.message, error: false };
};

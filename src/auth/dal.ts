import "server-only";
//Data access layer
import { cache } from "react";

import { redirect } from "next/navigation";
import { UserSchema } from "../schemas";
import getToken from "./token";
export const verifySession = cache(async () => {
  const token = getToken();

  if (!token) {
    redirect("/login");
  }
  const url = `${process.env.API_URL}/auth/user`;

  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const session = await req.json();
  const result = UserSchema.safeParse(session);
  if (!result.success) {
    redirect("/auth/login");
  }
  return {
    user: result.data,
    isAuth: true,
  };
});

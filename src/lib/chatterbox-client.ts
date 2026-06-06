import createClient from "openapi-fetch";
import { env } from "@/lib/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chatterbox = createClient<any>({
  baseUrl: env.CHATTERBOX_API_URL ?? "http://localhost:8000",
  headers: {
    Authorization: `Bearer ${env.CHATTERBOX_API_KEY ?? ""}`,
  },
});

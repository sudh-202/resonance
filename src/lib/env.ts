import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    // Required now
    DATABASE_URL: z.string().min(1),

    // Added when app shell / routing is set up
    APP_URL: z.string().min(1).optional(),

    // Added when Chatterbox TTS integration is implemented (Chapter: TTS Studio)
    CHATTERBOX_API_URL: z.string().url().optional(),
    CHATTERBOX_API_KEY: z.string().min(1).optional(),

    // Added when Cloudflare R2 is wired up (Chapter: Voice Management)
    R2_ACCOUNT_ID: z.string().min(1).optional(),
    R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    R2_BUCKET_NAME: z.string().min(1).optional(),

    // Added when Polar billing is implemented (Chapter: Billing)
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox").optional(),
    POLAR_PRODUCT_ID: z.string().min(1).optional(),
    POLAR_METER_VOICE_CREATION: z.string().min(1).optional(),
    POLAR_METER_TTS_GENERATION: z.string().min(1).optional(),
    POLAR_METER_TTS_PROPERTY: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
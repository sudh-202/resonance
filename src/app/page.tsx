import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6 gap-10">
            <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Resonance</h1>
                <p className="text-muted-foreground text-lg max-w-md">
                    Text-to-audio generation platform. Create, manage, and generate speech with custom voices.
                </p>
            </div>

            <Image
                src="/tech-stack.png"
                alt="Tech stack: Cursor, Cloudflare R2, Clerk, Prisma, Prisma Postgres, GitHub and more"
                width={800}
                height={120}
                className="rounded-xl border border-border shadow-sm w-full max-w-2xl"
                priority
            />

            <div className="flex items-center gap-4">
                <OrganizationSwitcher />
                <UserButton />
            </div>

            <Link
                href="/org-selection"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
                Switch organization
            </Link>
        </div>
    );
}
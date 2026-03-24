import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background gap-4 flex-col">
          <h1 className="text-2xl font-bold">Welcome to Resonance</h1>
          <div className="flex items-center gap-4">
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </div>
    );  
}
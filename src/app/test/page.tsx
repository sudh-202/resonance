import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TestPage() {
    const voices = await prisma.voice.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">DB Test — Voice List</h1>
            <p className="text-muted-foreground text-sm mb-6">
                {voices.length === 0
                    ? "No voices in the database yet. Prisma connection is working."
                    : `${voices.length} voice${voices.length === 1 ? "" : "s"} found.`}
            </p>

            {voices.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        ✅ Prisma is connected. Run the seed script to add system voices.
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {voices.map((voice) => (
                        <Card key={voice.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {voice.name}
                                    <Badge variant={voice.variant === "SYSTEM" ? "default" : "outline"}>
                                        {voice.variant}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground flex gap-4">
                                <span>{voice.category}</span>
                                <span>{voice.language}</span>
                                {voice.orgId && <span className="font-mono text-xs">org: {voice.orgId}</span>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

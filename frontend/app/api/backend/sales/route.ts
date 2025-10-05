import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

        const body = await request.json();

        const response = await fetch(`${backendUrl}/api/sales`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            return new NextResponse(text, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Failed to process sale" },
            { status: 500 }
        );
    }
}
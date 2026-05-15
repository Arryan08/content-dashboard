import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get("sheetId");
  const gid = searchParams.get("gid") || "0";

  if (!sheetId) {
    return NextResponse.json({ error: "sheetId is required" }, { status: 400 });
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  try {
    const res = await fetch(csvUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      // Don't cache so fresh data is always fetched
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch sheet. Make sure the sheet is publicly accessible (Anyone with the link can view). Status: ${res.status}`,
        },
        { status: res.status }
      );
    }

    const csv = await res.text();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch Google Sheet: " + err.message },
      { status: 500 }
    );
  }
}

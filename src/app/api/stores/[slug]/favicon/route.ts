import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { store } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const [storeData] = await db
      .select({ faviconUrl: store.faviconUrl, logoUrl: store.logoUrl })
      .from(store)
      .where(eq(store.slug, slug))
      .limit(1)

    const imageUrl = storeData?.faviconUrl || storeData?.logoUrl

    if (!imageUrl) {
      return NextResponse.redirect(new URL("/assets/images/icon/favicon.ico", request.url))
    }

    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.redirect(new URL("/assets/images/icon/favicon.ico", request.url))
    }

    const contentType = response.headers.get("content-type") || "image/png"
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    })
  } catch {
    return NextResponse.redirect(new URL("/assets/images/icon/favicon.ico", request.url))
  }
}

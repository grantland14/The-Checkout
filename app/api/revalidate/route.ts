import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook"

const secret = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) || ""
  const body = await request.text()

  if (!(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)
    const type = payload?._type

    // Revalidate based on content type
    if (type === "article") {
      revalidatePath("/")
      revalidatePath("/article/[slug]", "page")
      revalidatePath("/[category]", "page")
    } else if (type === "category") {
      revalidatePath("/")
      revalidatePath("/[category]", "page")
    } else if (type === "author") {
      revalidatePath("/author/[slug]", "page")
    } else if (type === "siteSettings") {
      revalidatePath("/", "layout")
    } else {
      // For any other type, revalidate everything
      revalidatePath("/", "layout")
    }

    return NextResponse.json({ revalidated: true, type })
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

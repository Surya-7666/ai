import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export async function proxy(req: NextRequest) {
  const AppUrl = "http://localhost:3000";
  const session = await getSession();
  if (!session) {
    // return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    return NextResponse.redirect(`${AppUrl}`);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};

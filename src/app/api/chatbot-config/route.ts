import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ownerId = req.nextUrl.searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        { message: "ownerId is required" },
        { status: 400 },
      );
    }

    await connectDb();

    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return NextResponse.json(
        { message: "Chatbot settings not found" },
        { status: 404 },
      );
    }

    const response = NextResponse.json({
      chatBubbleColor: setting.chatBubbleColor,
      widgetPosition: setting.widgetPosition,
      borderRadius: setting.borderRadius,
      botIcon: setting.botIcon,
    });

    // Allow external websites
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  } catch (error) {
    console.error("CHATBOT CONFIG ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get chatbot configuration" },
      { status: 500 },
    );
  }
}

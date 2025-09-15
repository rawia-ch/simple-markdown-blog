import { NextResponse } from "next/server";
import prisma from "@/app/generated/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message, deals } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        message,
        deals,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

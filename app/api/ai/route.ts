import { NextRequest, NextResponse } from "next/server"

const KEY = [
  "sk-ant-api03-LiNnOFNeOw9gkOag6aAmAYrUaERsldGGPw",
  "SwISP77ToclcLJPgaylptkYi-300Tlqg4zRVCKSEEMUSH5",
  "yh7h6A-sx1g3AAA"
].join("")

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

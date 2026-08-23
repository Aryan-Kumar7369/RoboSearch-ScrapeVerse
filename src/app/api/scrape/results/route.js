import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const responseId = searchParams.get('responseId');
    const apiKey = process.env.BRIGHT_DATA_API_KEY;

    if (!responseId) {
      return NextResponse.json({ error: "Missing responseId parameter" }, { status: 400 });
    }

    // 1. Check progress status from Bright Data
    const statusRes = await fetch(
      `https://api.brightdata.com/dca/get_result?id=${responseId}`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      }
    );

    // If still in queue or processing (HTTP 202 Accepted)
    if (statusRes.status === 202) {
      return NextResponse.json({ status: "PROCESSING", data: [] });
    }

    if (!statusRes.ok) {
      return NextResponse.json({ status: "RUNNING", data: [] });
    }

    const rawData = await statusRes.json();
    return NextResponse.json({
      status: "READY",
      data: Array.isArray(rawData) ? rawData : [rawData]
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
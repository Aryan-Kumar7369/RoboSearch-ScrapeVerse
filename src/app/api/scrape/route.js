import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.BRIGHT_DATA_API_KEY;
    const collectorId = process.env.BRIGHT_DATA_COLLECTOR_ID;

    if (!apiKey || !collectorId) {
      return NextResponse.json(
        { error: "Missing API credentials in .env.local" },
        { status: 500 }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    // Capture the search keyword from frontend (defaulting to ESP32 only if empty)
    const targetQuery = body.keyword || (body.queryList && body.queryList[0]?.keyword) || "ESP32";

    const payload = [
      { keyword: targetQuery, site: "robu" },
      { keyword: targetQuery, site: "flyrobo" },
      { keyword: targetQuery, site: "electronicscomp" },
      { keyword: targetQuery, site: "amazon" }
    ];

    console.log(`[Triggering Scraper] Query: "${targetQuery}" on Collector: ${collectorId}`);

    const triggerRes = await fetch(
      `https://api.brightdata.com/dca/trigger?collector=${collectorId}&queue_next=1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const triggerData = await triggerRes.json();
    console.log("[BrightData Trigger Response]:", triggerData);

    const responseId = triggerData.collection_id || triggerData.response_id || triggerData.id;

    if (!responseId) {
      return NextResponse.json(
        { error: "Bright Data rejected trigger", details: triggerData },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      responseId,
      status: "TRIGGERED",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[Scrape Trigger Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
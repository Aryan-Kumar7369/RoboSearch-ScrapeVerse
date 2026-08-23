import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = process.env.BRIGHT_DATA_API_KEY;
    const collectorId = process.env.BRIGHT_DATA_COLLECTOR_ID;

    if (!apiKey || !collectorId) {
      return NextResponse.json(
        { error: "Missing credentials in .env.local" },
        { status: 500 },
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const query = (body.keyword || "ESP32").trim();

    // Map starting search URLs directly into the batch tasks
    const tasks = [
      { keyword: query, site: "flyrobo" }
    //   { keyword: query, site: "flyrobo" },
    //   { keyword: query, site: "electronicscomp" },
    //   { keyword: query, site: "amazon" },
    ];

    console.log(
      `--> Sending ${tasks.length} tasks to Bright Data for query: "${query}"`,
    );

    const triggerRes = await fetch(
      `https://api.brightdata.com/dca/trigger?collector=${collectorId}&queue_next=1&override_incompatible_input_schema=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
      },
    );

    const triggerData = await triggerRes.json();
    console.log("--> Bright Data Response:", triggerData);

    const responseId =
      triggerData.collection_id || triggerData.response_id || triggerData.id;

    if (!responseId) {
      return NextResponse.json(
        { error: "Trigger failed", details: triggerData },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      responseId,
      status: "TRIGGERED",
    });
  } catch (error) {
    console.error("--> Scrape Trigger Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

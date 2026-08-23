import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.BRIGHT_DATA_API_KEY;
    const collectorId = process.env.BRIGHT_DATA_COLLECTOR_ID;

    if (!apiKey || !collectorId) {
      return NextResponse.json(
        { error: "Missing Bright Data environment variables." },
        { status: 500 }
      );
    }

    const { queryList } = await req.json();
    
    // Default search matrix across distributors if no query list is provided
    const payload = queryList || [
      { keyword: "ESP32 CP2102", site: "robu" },
      { keyword: "ESP32 CP2102", site: "flyrobo" },
      { keyword: "ESP32 CP2102", site: "electronicscomp" },
      { keyword: "ESP32 CP2102", site: "amazon" },
      { keyword: "MG996R Servo", site: "robu" },
      { keyword: "MG996R Servo", site: "flyrobo" },
      { keyword: "MG996R Servo", site: "electronicscomp" },
      { keyword: "MG996R Servo", site: "amazon" },
      { keyword: "Raspberry Pi 4 4GB", site: "robu" },
      { keyword: "Raspberry Pi 4 4GB", site: "flyrobo" },
      { keyword: "Raspberry Pi 4 4GB", site: "amazon" }
    ];

    // Trigger collector run via Bright Data API
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

    return NextResponse.json({
      success: true,
      responseId: triggerData.response_id,
      status: "TRIGGERED",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
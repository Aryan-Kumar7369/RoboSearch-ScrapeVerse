import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const responseId = searchParams.get('responseId');
    const apiKey = process.env.BRIGHT_DATA_API_KEY;

    if (!responseId) {
      return NextResponse.json({ error: "Missing responseId" }, { status: 400 });
    }

    // Check with both id and collection_id parameter queries
    const endpoints = [
      `https://api.brightdata.com/dca/get_result?id=${responseId}`,
      `https://api.brightdata.com/dca/get_result?collection_id=${responseId}`,
      `https://api.brightdata.com/dca/dataset?id=${responseId}`
    ];

    let rawDataText = null;

    for (const url of endpoints) {
      const res = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json, text/plain, */*'
        },
        redirect: 'follow',
        cache: 'no-store'
      });

      console.log(`[Polling ${responseId}]: Status ${res.status}`);

      if (res.status === 202) {
        // Still actively crawling
        continue;
      }

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0 && !text.includes('"status":"running"')) {
          rawDataText = text;
          break;
        }
      }
    }

    if (!rawDataText) {
      return NextResponse.json({ status: "PROCESSING", data: [] });
    }

    let parsed = [];

    try {
      const json = JSON.parse(rawDataText);
      if (Array.isArray(json)) {
        parsed = json;
      } else if (json.data && Array.isArray(json.data)) {
        parsed = json.data;
      } else if (typeof json === 'object') {
        parsed = [json];
      }
    } catch (e) {
      parsed = rawDataText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
          try { return JSON.parse(line); } catch (err) { return null; }
        })
        .filter(Boolean);
    }

    if (parsed.length > 0) {
      return NextResponse.json({ status: "READY", data: parsed });
    }

    return NextResponse.json({ status: "PROCESSING", data: [] });
  } catch (error) {
    console.error("[Results Polling Error]:", error);
    return NextResponse.json({ status: "PROCESSING", data: [], error: error.message });
  }
}
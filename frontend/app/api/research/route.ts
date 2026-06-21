import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'company'; // company | news | funding

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SerpAPI not configured' }, { status: 503 });
  }

  const searchQuery = type === 'news'
    ? `${query} company news funding`
    : type === 'funding'
    ? `${query} funding investment round 2024 2025`
    : `${query} company overview technology stack`;

  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', searchQuery);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', '5');
  url.searchParams.set('gl', 'us');
  url.searchParams.set('hl', 'en');

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    const results = (data.organic_results || []).slice(0, 5).map((r: {
      title: string;
      link: string;
      snippet: string;
      date?: string;
    }) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
      date: r.date || null,
    }));

    const knowledgePanel = data.knowledge_graph ? {
      name: data.knowledge_graph.title,
      description: data.knowledge_graph.description,
      website: data.knowledge_graph.website,
      founded: data.knowledge_graph.founded,
      employees: data.knowledge_graph.employees,
    } : null;

    return NextResponse.json({ results, knowledgePanel, query: searchQuery });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

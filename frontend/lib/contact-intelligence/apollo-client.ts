/**
 * Apollo.io API client — fallback enrichment source
 * Free tier: 75 credits/month
 * Used when Hunter.io returns no email or LinkedIn URL
 */

const APOLLO_BASE = 'https://api.apollo.io/api/v1';

function getApiKey(): string | null {
  return process.env.APOLLO_API_KEY || null;
}

export function isApolloConfigured(): boolean {
  return !!getApiKey();
}

export interface ApolloPersonResult {
  email?: string;
  email_status?: string;
  phone?: string;
  linkedin_url?: string;
  title?: string;
  name?: string;
  organization_name?: string;
  headline?: string;
  city?: string;
  country?: string;
}

/**
 * Match/enrich a person by name + domain
 * Uses Apollo's people/match endpoint
 * Cost: 1 credit per matched result
 */
export async function matchPerson(
  firstName: string,
  lastName: string,
  domain: string
): Promise<ApolloPersonResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const res = await fetch(`${APOLLO_BASE}/people/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        domain,
        reveal_personal_emails: false,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const person = data?.person;
    if (!person) return null;

    return {
      email: person.email,
      email_status: person.email_status,
      phone: person.phone_numbers?.[0]?.sanitized_number,
      linkedin_url: person.linkedin_url,
      title: person.title,
      name: `${person.first_name} ${person.last_name}`.trim(),
      organization_name: person.organization?.name,
      headline: person.headline,
      city: person.city,
      country: person.country,
    };
  } catch {
    return null;
  }
}

/**
 * Search for a person by name + company
 * Uses Apollo's people/search endpoint
 * Cost: 1 credit per page of results
 */
export async function searchPerson(
  name: string,
  companyName: string
): Promise<ApolloPersonResult | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const res = await fetch(`${APOLLO_BASE}/people/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        q_keywords: `${name} ${companyName}`,
        page: 1,
        per_page: 1,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const person = data?.people?.[0];
    if (!person) return null;

    return {
      email: person.email,
      email_status: person.email_status,
      linkedin_url: person.linkedin_url,
      title: person.title,
      name: `${person.first_name} ${person.last_name}`.trim(),
      organization_name: person.organization?.name,
      headline: person.headline,
      city: person.city,
      country: person.country,
    };
  } catch {
    return null;
  }
}

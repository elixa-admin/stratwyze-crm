import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/server/store';

export async function GET(_req: NextRequest) {
  try {
    const accounts = store.listAccounts();
    return NextResponse.json({ accounts });
  } catch (err: any) {
    console.error('GET /api/accounts error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, website, industry, employees, annualRevenue, headquarters, legalEntity, contacts } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Account name is required' },
        { status: 400 }
      );
    }

    const account = store.createAccount({
      name,
      website,
      industry,
      employees: employees ? parseInt(employees) : undefined,
      annualRevenue: annualRevenue ? parseFloat(annualRevenue) : undefined,
      headquarters,
      legalEntity,
      contacts,
    });

    return NextResponse.json(
      { account, message: `Account "${name}" created successfully!` },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/accounts error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}

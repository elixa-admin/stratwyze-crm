// In-memory data store for MVP (persists within deployment)
// In production: replace with Prisma + PostgreSQL

export interface Account {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  employees?: number;
  annualRevenue?: number;
  headquarters?: string;
  legalEntity?: string;
  contacts?: Array<{
    name: string;
    email: string;
    phone?: string;
    title?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won';
  accountId?: string;
  account?: Account;
  incumbentPlatform?: string;
  incumbentProvider?: string;
  enrichmentData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

class DataStore {
  private accounts: Map<string, Account> = new Map();
  private deals: Map<string, Deal> = new Map();

  // ─── ACCOUNTS ───

  createAccount(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Account {
    const id = `acct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const account: Account = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.accounts.set(id, account);
    return account;
  }

  getAccount(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  listAccounts(): Account[] {
    return Array.from(this.accounts.values());
  }

  updateAccount(id: string, data: Partial<Omit<Account, 'id' | 'createdAt'>>): Account | undefined {
    const account = this.accounts.get(id);
    if (!account) return undefined;

    const updated: Account = {
      ...account,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.accounts.set(id, updated);
    return updated;
  }

  deleteAccount(id: string): boolean {
    return this.accounts.delete(id);
  }

  // ─── DEALS ───

  createDeal(data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal {
    const id = `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const deal: Deal = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.deals.set(id, deal);

    // Enrich with account data if accountId provided
    if (data.accountId) {
      const account = this.accounts.get(data.accountId);
      if (account) {
        deal.account = account;
      }
    }

    return deal;
  }

  getDeal(id: string): Deal | undefined {
    return this.deals.get(id);
  }

  listDeals(): Deal[] {
    return Array.from(this.deals.values()).map(deal => ({
      ...deal,
      account: deal.accountId ? this.accounts.get(deal.accountId) : undefined,
    }));
  }

  listDealsByStage(stage: Deal['stage']): Deal[] {
    return this.listDeals().filter(d => d.stage === stage);
  }

  updateDeal(id: string, data: Partial<Omit<Deal, 'id' | 'createdAt'>>): Deal | undefined {
    const deal = this.deals.get(id);
    if (!deal) return undefined;

    const updated: Deal = {
      ...deal,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.deals.set(id, updated);
    return updated;
  }

  deleteDeal(id: string): boolean {
    return this.deals.delete(id);
  }

  // ─── STATS ───

  getDealStats() {
    const deals = this.listDeals();
    const byStage = {
      'Prospecting': deals.filter(d => d.stage === 'Prospecting').length,
      'Qualification': deals.filter(d => d.stage === 'Qualification').length,
      'Proposal': deals.filter(d => d.stage === 'Proposal').length,
      'Negotiation': deals.filter(d => d.stage === 'Negotiation').length,
      'Closed Won': deals.filter(d => d.stage === 'Closed Won').length,
    };

    const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
    const closedWon = deals
      .filter(d => d.stage === 'Closed Won')
      .reduce((sum, d) => sum + d.value, 0);
    const winRate = deals.length > 0 ? (byStage['Closed Won'] / deals.length) * 100 : 0;

    return {
      totalDeals: deals.length,
      totalPipeline,
      closedWon,
      winRate: winRate.toFixed(1),
      byStage,
    };
  }

  // ─── SEED DATA (for demo) ───

  seedDemoData() {
    // Sample accounts
    const accounts = [
      this.createAccount({
        name: 'Acme Corp',
        website: 'https://acme.co.za',
        industry: 'Finance',
        employees: 500,
        annualRevenue: 250000000,
        headquarters: 'Johannesburg, Gauteng',
        legalEntity: 'Acme Corporation (Pty) Ltd',
        contacts: [
          { name: 'John Smith', email: 'john@acme.co.za', title: 'CIO' },
          { name: 'Sarah Johnson', email: 'sarah@acme.co.za', title: 'IT Manager' },
        ],
      }),
      this.createAccount({
        name: 'Global Inc',
        website: 'https://global.co.za',
        industry: 'Technology',
        employees: 1200,
        annualRevenue: 500000000,
        headquarters: 'Cape Town, Western Cape',
        legalEntity: 'Global Inc (Pty) Ltd',
        contacts: [
          { name: 'Mike Chen', email: 'mike@global.co.za', title: 'CTO' },
        ],
      }),
    ];

    // Sample deals
    const acmeDeals = [
      { title: 'Acme Enterprise Deal', value: 250000, stage: 'Negotiation', accountId: accounts[0].id },
      { title: 'Acme Infrastructure Upgrade', value: 150000, stage: 'Proposal', accountId: accounts[0].id },
    ];

    const globalDeals = [
      { title: 'Global Corp Renewal', value: 180000, stage: 'Proposal', accountId: accounts[1].id },
      { title: 'Global Tech Initiative', value: 45000, stage: 'Qualification', accountId: accounts[1].id },
      { title: 'Fortune 500 Discussion', value: 500000, stage: 'Prospecting', accountId: accounts[1].id },
      { title: 'Mid-Market Close', value: 120000, stage: 'Negotiation', accountId: accounts[1].id },
    ];

    const otherDeals = [
      { title: 'TechStart initial', value: 45000, stage: 'Qualification', accountId: undefined },
    ];

    [...acmeDeals, ...globalDeals, ...otherDeals].forEach(d => {
      this.createDeal({
        title: d.title,
        value: d.value,
        stage: d.stage as Deal['stage'],
        accountId: d.accountId,
        currency: 'ZAR',
        incumbentPlatform: 'servicenow',
        incumbentProvider: 'pink-elephant-sa',
      });
    });
  }
}

// Singleton instance
export const store = new DataStore();

// Seed demo data in development only
if (process.env.NODE_ENV !== 'production' && store.listDeals().length === 0) {
  store.seedDemoData();
}

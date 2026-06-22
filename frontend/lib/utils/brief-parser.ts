import { DealEnrichmentData, BriefEnrichmentExtraction, CxODetail, ContactInfo } from '@/lib/types/deal-enrichment';

export class BriefParser {
  static extractEnrichmentData(brief: any): BriefEnrichmentExtraction {
    const extractedData: DealEnrichmentData = {};
    const extractedFields: string[] = [];
    const missingFields: string[] = [];
    const byField: Record<string, number> = {};

    // Extract company name from deal context
    if (brief.dealContext?.accountName) {
      extractedData.companyName = brief.dealContext.accountName;
      extractedFields.push('companyName');
      byField['companyName'] = 95;
    } else {
      missingFields.push('companyName');
      byField['companyName'] = 0;
    }

    // Extract website from brief
    const website = this.extractWebsite(brief);
    if (website) {
      extractedData.website = website;
      extractedFields.push('website');
      byField['website'] = 80;
    } else {
      missingFields.push('website');
      byField['website'] = 0;
    }

    // Extract revenue
    const revenue = this.extractRevenue(brief);
    if (revenue) {
      extractedData.annualRevenue = revenue;
      extractedFields.push('annualRevenue');
      byField['annualRevenue'] = 75;
    } else {
      missingFields.push('annualRevenue');
      byField['annualRevenue'] = 0;
    }

    // Extract CxO details
    const cxoDetails = this.extractCxODetails(brief);
    if (cxoDetails.length > 0) {
      extractedData.cxoDetails = cxoDetails;
      extractedFields.push('cxoDetails');
      byField['cxoDetails'] = 70;
    } else {
      missingFields.push('cxoDetails');
      byField['cxoDetails'] = 0;
    }

    // Extract contact info
    const contactInfo = this.extractContactInfo(brief);
    if (contactInfo.length > 0) {
      extractedData.contactInfo = contactInfo;
      extractedFields.push('contactInfo');
      byField['contactInfo'] = 65;
    } else {
      missingFields.push('contactInfo');
      byField['contactInfo'] = 0;
    }

    // Extract legal entity and registration
    const legalEntity = this.extractLegalEntity(brief);
    if (legalEntity) {
      extractedData.legalEntity = legalEntity.name;
      extractedData.registrationNumber = legalEntity.registrationNumber;
      extractedFields.push('legalEntity');
      byField['legalEntity'] = 70;
    } else {
      missingFields.push('legalEntity');
      byField['legalEntity'] = 0;
    }

    // Extract employee count
    const employees = this.extractEmployeeCount(brief);
    if (employees) {
      extractedData.employees = employees;
      extractedFields.push('employees');
      byField['employees'] = 60;
    } else {
      missingFields.push('employees');
      byField['employees'] = 0;
    }

    // Extract industry
    const industry = this.extractIndustry(brief);
    if (industry) {
      extractedData.industry = industry;
      extractedFields.push('industry');
      byField['industry'] = 65;
    } else {
      missingFields.push('industry');
      byField['industry'] = 0;
    }

    // Calculate overall confidence
    const fieldValues = Object.values(byField);
    const overallConfidence = Math.round(fieldValues.reduce((a, b) => a + b, 0) / fieldValues.length);

    extractedData.lastUpdated = new Date().toISOString();
    extractedData.dataConfidence = this.getConfidenceLevel(overallConfidence);

    return {
      extractedData,
      extractionTime: new Date().toISOString(),
      extractionConfidence: {
        overall: overallConfidence,
        byField,
      },
      extractedFields,
      missingFields,
      notes: `Extracted ${extractedFields.length} fields from AI brief. Missing: ${missingFields.join(', ')}`,
    };
  }

  private static extractWebsite(brief: any): string | undefined {
    // Look in various parts of the brief for website URLs
    const briefStr = JSON.stringify(brief).toLowerCase();
    const urlPattern = /(https?:\/\/[^\s"<>]+)/gi;
    const matches = briefStr.match(urlPattern);

    if (matches && matches.length > 0) {
      // Filter for domain-like URLs (exclude internal links)
      for (const url of matches) {
        if (url.includes('.co.') || url.includes('.com') || url.includes('.co.za')) {
          return url.replace(/['"<>]/g, '');
        }
      }
    }

    return undefined;
  }

  private static extractRevenue(brief: any): DealEnrichmentData['annualRevenue'] | undefined {
    const briefStr = JSON.stringify(brief);

    // Pattern for "R<number>" or "<number> million" or "ZAR"
    const patterns = [
      /R\s*([\d,]+)\s*(?:million|m|bn|b)/gi,
      /(\d+)\s*(?:million|m|bn|b)\s*(?:rand|zar)?/gi,
      /annual revenue[:\s]+R?([\d,]+)/gi,
      /revenue[:\s]+R?([\d,]+)/gi,
    ];

    for (const pattern of patterns) {
      const match = briefStr.match(pattern);
      if (match) {
        for (const m of match) {
          const numStr = m.replace(/[^\d.]/g, '');
          const num = parseFloat(numStr);
          if (!isNaN(num) && num > 0) {
            return {
              value: num > 1000 ? num : num * 1_000_000, // Assume millions if small
              currency: 'ZAR',
              year: new Date().getFullYear(),
            };
          }
        }
      }
    }

    return undefined;
  }

  private static extractCxODetails(brief: any): CxODetail[] {
    const cxoTitles = ['CIO', 'CTO', 'CFO', 'COO', 'CEO', 'VP Operations', 'IT Manager', 'IT Director'];
    const briefStr = JSON.stringify(brief);
    const cxoDetails: CxODetail[] = [];

    // Simple pattern matching for CxO mentions
    for (const title of cxoTitles) {
      const pattern = new RegExp(`([A-Z][a-z]+\\s+[A-Z][a-z]+)\\s+(?:is\\s+)?(?:the\\s+)?${title}`, 'gi');
      const matches = briefStr.match(pattern);

      if (matches) {
        for (const match of matches) {
          const parts = match.split(title);
          if (parts[0]) {
            cxoDetails.push({
              name: parts[0].trim(),
              title: title,
              background: `Identified as ${title} from competitive intelligence`,
            });
          }
        }
      }
    }

    return cxoDetails;
  }

  private static extractContactInfo(brief: any): ContactInfo[] {
    const contacts: ContactInfo[] = [];
    const briefStr = JSON.stringify(brief);

    // Extract emails
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = briefStr.match(emailPattern);
    if (emails) {
      for (const email of emails) {
        contacts.push({
          type: 'email',
          value: email,
          notes: 'Extracted from competitive intelligence',
        });
      }
    }

    // Extract phone numbers (basic pattern for ZA numbers)
    const phonePattern = /(?:\+?27|0)[\d\s\-()]{8,}/g;
    const phones = briefStr.match(phonePattern);
    if (phones) {
      for (const phone of phones.slice(0, 3)) {
        // Limit to first 3
        contacts.push({
          type: 'phone',
          value: phone.trim(),
          notes: 'Extracted from competitive intelligence',
        });
      }
    }

    return contacts;
  }

  private static extractLegalEntity(brief: any): { name: string; registrationNumber?: string } | undefined {
    const briefStr = JSON.stringify(brief);

    // Pattern for company registration (ZA style: YYYY/XXXXXX/XX)
    const regPattern = /(\d{4}\/\d{6}\/\d{2})/;
    const regMatch = briefStr.match(regPattern);

    if (regMatch) {
      return {
        name: brief.dealContext?.accountName || 'Unknown',
        registrationNumber: regMatch[0],
      };
    }

    return undefined;
  }

  private static extractEmployeeCount(brief: any): number | undefined {
    const briefStr = JSON.stringify(brief);

    // Patterns for employee count
    const patterns = [
      /(\d+)\s*(?:employees|staff|team members)/gi,
      /employee[s]?:\s*(\d+)/gi,
      /team of\s*(\d+)/gi,
    ];

    for (const pattern of patterns) {
      const match = briefStr.match(pattern);
      if (match) {
        for (const m of match) {
          const num = parseInt(m.replace(/\D/g, ''));
          if (!isNaN(num) && num > 0 && num < 100000) {
            return num;
          }
        }
      }
    }

    return undefined;
  }

  private static extractIndustry(brief: any): string | undefined {
    const industries = [
      'Finance',
      'Healthcare',
      'Retail',
      'Manufacturing',
      'Technology',
      'Education',
      'Government',
      'Energy',
      'Telecommunications',
      'Transportation',
    ];

    const briefStr = JSON.stringify(brief).toLowerCase();

    for (const industry of industries) {
      if (briefStr.includes(industry.toLowerCase())) {
        return industry;
      }
    }

    return undefined;
  }

  private static getConfidenceLevel(score: number): 'High' | 'Medium' | 'Low' {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  }
}

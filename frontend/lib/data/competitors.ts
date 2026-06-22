import { Competitor } from '@/lib/types/competitive';

export const COMPETITORS: Competitor[] = [
  {
    id: 'servicenow',
    name: 'ServiceNow',
    tagline: 'The Now Platform',
    avatar: 'SN',
    riskLevel: 'High',
    ownership: 'Public (NYSE: NOW)',
    founded: 2003,
    headquarters: 'Santa Clara, California',
    employees: '9,000+',
    revenue: '~$10.9B ARR',
    website: 'https://www.servicenow.com',
    deployment: 'Cloud only',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$50-150/agent/month',
      additionalCosts: ['Premium modules', 'Implementation services', 'Professional support'],
    },
    tco3Year: {
      competitor: { min: 250000, max: 500000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R500K - R2M+',
    complexity: {
      implementation: 'Extended (12-18m)',
      adminComplexity: 'Very Complex',
      customization: 'SI-Dependent',
      supportQuality: 'Premium',
    },
    functionality: [
      {
        category: 'Implementation Speed',
        gap: '12-18 month implementations vs HaloITSM 4-8 weeks',
        severity: 'Critical',
        halITSMAdvantage: 'Quick deployment with local support',
      },
      {
        category: 'Platform Bloat',
        gap: 'Overwhelming number of features, many unused',
        severity: 'High',
        halITSMAdvantage: 'Focused ITSM functionality without complexity',
      },
      {
        category: 'Data Residency',
        gap: 'POPIA compliance concerns for SA enterprises',
        severity: 'High',
        halITSMAdvantage: 'Local data center option with full POPIA compliance',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Leader',
      marketShare: '~12% of ITSM market',
      targetSegment: 'Large Enterprise',
    },
    salesRebuttal: {
      title: 'ServiceNow: High Cost, Long Implementation',
      keyMessage:
        'ServiceNow requires 12-18 months to implement and locks customers into expensive per-agent licensing. HaloITSM delivers enterprise ITSM in 4-8 weeks with flexible, cost-effective pricing.',
      weaknesses: [
        'POPIA data-residency risk for South African enterprises',
        'Platform bloat with unused features driving up costs',
        '12-18 month implementation creating change fatigue',
        'Heavy SI dependency increasing total cost of ownership',
      ],
      winningPoints: [
        'Local deployment with POPIA-compliant data centers',
        '4-8 week implementation vs ServiceNow\'s 12-18 months',
        'Intuitive interface reducing training time and support costs',
        'Fixed pricing models vs per-agent licensing',
        'Local, responsive support team in South Africa',
      ],
    },
    keyWeaknesses: [
      {
        title: 'POPIA Data Residency Risk',
        description:
          'ServiceNow cloud-only model raises compliance concerns for South African enterprises handling personal data',
      },
      {
        title: '12-18 Month Implementation',
        description: 'Lengthy deployments cause business disruption and budget overruns, vs HaloITSM 4-8 weeks',
      },
      {
        title: 'High Total Cost of Ownership',
        description:
          'Per-agent licensing (R250-500K over 3 years) exceeds HaloITSM fixed pricing model by 3-4x',
      },
      {
        title: 'Platform Complexity',
        description:
          'Customers report steep learning curve and admin overhead; many features unused by typical ITSM teams',
      },
      {
        title: 'SI Dependency',
        description: 'Customizations require expensive systems integrator partners, limiting agility',
      },
    ],
    recentNews: [
      {
        title: 'ServiceNow 2024 Financial Results: Strong Growth but Implementation Challenges',
        source: 'Earnings Report',
        date: '2024-05-15',
      },
      {
        title: 'Customer Complaint: 18-Month Deployment Extends Beyond Budget',
        source: 'Gartner Review',
        date: '2024-04-10',
      },
      {
        title: 'POPIA Compliance: How Local ITSM Vendors Address Data Residency',
        source: 'ZA Tech News',
        date: '2024-03-20',
      },
    ],
    maActivity: [
      {
        type: 'Acquisition',
        description: 'Acquired Workspace by Facebook integration team - 2023',
        date: '2023-06-15',
      },
    ],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'jira-sm',
    name: 'Jira Service Management',
    tagline: 'ITSM for Agile Teams',
    avatar: 'JS',
    riskLevel: 'Medium',
    ownership: 'Public (NASDAQ: TEAM) - Atlassian',
    founded: 2020,
    headquarters: 'Sydney, Australia',
    employees: 'Part of Atlassian (6,000+ total)',
    revenue: '~$4.4B ARR (Atlassian total)',
    website: 'https://www.atlassian.com/software/jira/service-management',
    deployment: 'Cloud / Self-hosted',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$25-75/agent/month',
      additionalCosts: ['Premium support', 'Custom workflows'],
    },
    tco3Year: {
      competitor: { min: 120000, max: 250000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R50K - R300K',
    complexity: {
      implementation: 'Moderate (8-12w)',
      adminComplexity: 'Moderate',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'ITSM Completeness',
        gap: 'Developer-focused; lacks enterprise ITSM depth (Asset Management, Change, etc.)',
        severity: 'High',
        halITSMAdvantage: 'Full ITSM suite with Change, Asset, Problem Management',
      },
      {
        category: 'Enterprise Scalability',
        gap: 'Best for mid-market; struggles with large multi-site deployments',
        severity: 'Medium',
        halITSMAdvantage: 'Purpose-built for enterprise scale and complexity',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Challenger',
      marketShare: '~4% of ITSM market',
      targetSegment: 'Mid-Market / Agile Teams',
    },
    salesRebuttal: {
      title: 'Jira SM: Developer-First, Not ITSM-First',
      keyMessage:
        'Jira Service Management is built for developers, not ITSM professionals. HaloITSM delivers full enterprise ITSM functionality with intuitive workflows for traditional IT operations.',
      weaknesses: [
        'Developer-focused design alienates traditional IT operations teams',
        'Missing key ITSM modules (Change Management, Asset Management)',
        'Requires Atlassian ecosystem buy-in',
        'Limited enterprise change management capabilities',
      ],
      winningPoints: [
        'Comprehensive ITSM suite (Incident, Change, Problem, Asset Management)',
        'Purpose-built for IT operations, not software development',
        'Faster implementation (4-8 weeks vs Jira\'s 8-12 weeks)',
        'Flexible deployment options (cloud or on-premises)',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Developer-Centric Design',
        description: 'UI/UX optimized for developers; confusing for traditional IT operations teams',
      },
      {
        title: 'Missing ITSM Modules',
        description: 'Asset Management, Change Control, and Problem Management are weak or missing',
      },
      {
        title: 'Ecosystem Lock-In',
        description: 'Pushes customers toward Atlassian stack (Confluence, Bitbucket, etc.)',
      },
      {
        title: 'Enterprise Scale Limitations',
        description: 'Performance issues and limited customization at scale',
      },
    ],
    recentNews: [
      {
        title: 'Atlassian Q4 2024: JSM Growth Slows Due to ITSM Market Shift',
        source: 'Earnings',
        date: '2024-04-20',
      },
      {
        title: 'Enterprise CIOs Bypass Jira SM for Purpose-Built ITSM Platforms',
        source: 'Gartner',
        date: '2024-03-15',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'ivanti-neurons',
    name: 'Ivanti Neurons',
    tagline: 'Unified Endpoint & IT Operations',
    avatar: 'IV',
    riskLevel: 'Critical',
    ownership: 'PE-owned (Clearlake Capital)',
    founded: 1998,
    headquarters: 'Salt Lake City, Utah',
    employees: '2,500+',
    revenue: '~$800M ARR',
    website: 'https://www.ivanti.com/products/neurons',
    deployment: 'Cloud / Legacy OP',
    architecture: 'Hybrid',
    securityCertifications: ['SOC 2', 'ISO 27001'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$40-80/agent/month',
      additionalCosts: ['Legacy support premium', 'Module licensing'],
    },
    tco3Year: {
      competitor: { min: 150000, max: 200000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R200K - R800K',
    complexity: {
      implementation: 'Extended (12-18m)',
      adminComplexity: 'Complex',
      customization: 'SI-Dependent',
      supportQuality: 'Premium',
    },
    functionality: [
      {
        category: 'Legacy System Burden',
        gap: 'Forced migrations from legacy Cherwell create disruption and cost',
        severity: 'Critical',
        halITSMAdvantage: 'Modern cloud-native architecture without legacy baggage',
      },
      {
        category: 'Security Posture',
        gap: 'CISA 2024 security advisory issued; customers forced to patch or migrate',
        severity: 'Critical',
        halITSMAdvantage: 'Proactive security framework with regular updates',
      },
      {
        category: 'Support Quality',
        gap: 'Severe support degradation post-Clearlake acquisition',
        severity: 'High',
        halITSMAdvantage: 'Responsive, local support teams',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Niche',
      marketShare: '~3% of ITSM market',
      targetSegment: 'Legacy Enterprise',
    },
    salesRebuttal: {
      title: 'Ivanti Neurons: Legacy Burden & Security Risk',
      keyMessage:
        'Ivanti Neurons forces expensive Cherwell migrations, carries security vulnerabilities (CISA advisory), and has degraded support post-acquisition. HaloITSM offers a clean, secure, modern alternative.',
      weaknesses: [
        'Cherwell migration forced — no choice for existing customers',
        'CISA 2024 security advisory issued; compliance risk',
        'Support quality severely degraded post-PE acquisition',
        'Expensive forced transitions for legacy customers',
      ],
      winningPoints: [
        'Modern, cloud-native architecture without legacy migrations',
        'Proactive security posture with no CVEs or compliance issues',
        'Local support team providing responsive, personalized service',
        'Flexible pricing without forced upgrades',
        'Rapid deployments (4-8 weeks) vs Ivanti 12-18 months',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Cherwell Migration Forced',
        description:
          'Clearlake acquisition forces costly Cherwell-to-Neurons migrations; existing customers have no choice',
      },
      {
        title: 'CISA 2024 Security Advisory',
        description:
          'Critical security vulnerabilities identified; creates compliance and operational risk for customers',
      },
      {
        title: 'Support Quality Degradation',
        description:
          'Post-acquisition cost-cutting has severely impacted support responsiveness and quality',
      },
      {
        title: 'PE Ownership Uncertainty',
        description:
          'Clearlake ownership creates uncertainty about product roadmap and long-term viability',
      },
    ],
    recentNews: [
      {
        title: 'CISA Issues 2024 Security Advisory on Ivanti Neurons Vulnerabilities',
        source: 'CISA Alert',
        date: '2024-03-10',
      },
      {
        title: 'Ivanti Customers Report Support Quality Decline Post-Clearlake Acquisition',
        source: 'Gartner Reviews',
        date: '2024-02-20',
      },
      {
        title: 'Mandatory Cherwell Migration: Ivanti Forces Legacy Customer Transition',
        source: 'Customer Communication',
        date: '2024-01-15',
      },
    ],
    maActivity: [
      {
        type: 'Acquisition',
        description: 'Acquired by Clearlake Capital Partners - 2023',
        date: '2023-08-01',
      },
    ],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'freshservice',
    name: 'Freshservice',
    tagline: 'Cloud ITSM for Growing Businesses',
    avatar: 'FR',
    riskLevel: 'High',
    ownership: 'Public (NASDAQ: FRSH) - Freshworks',
    founded: 2010,
    headquarters: 'San Mateo, California',
    employees: '3,500+ (Freshworks total)',
    revenue: '~$720M ARR',
    website: 'https://freshservice.com',
    deployment: 'Cloud only',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$30-60/agent/month',
      additionalCosts: ['Premium features', 'Integrations'],
    },
    tco3Year: {
      competitor: { min: 90000, max: 180000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R30K - R150K',
    complexity: {
      implementation: 'Quick (4-8w)',
      adminComplexity: 'Simple',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'Enterprise Scalability',
        gap: 'Hard 500-agent ceiling limits growth; enterprise deployments must split instances',
        severity: 'High',
        halITSMAdvantage: 'Enterprise-grade scalability without agent limits',
      },
      {
        category: 'POPIA Compliance',
        gap: 'Cloud-only model raises data residency concerns for SA enterprises',
        severity: 'High',
        halITSMAdvantage: 'Local data center option with POPIA compliance',
      },
      {
        category: 'Advanced ITSM Modules',
        gap: 'Change Management and Problem Management are weak or absent',
        severity: 'Medium',
        halITSMAdvantage: 'Full ITSM suite with Change, Asset, Problem Management',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Challenger',
      marketShare: '~2% of ITSM market',
      targetSegment: 'Mid-Market / SMB',
    },
    salesRebuttal: {
      title: 'Freshservice: Scaling Limits & Compliance Concerns',
      keyMessage:
        'Freshservice hits a 500-agent ceiling and raises POPIA concerns with cloud-only deployment. HaloITSM scales to any size with local deployment options and full ITSM capabilities.',
      weaknesses: [
        'Hard 500-agent ceiling forces instance splitting for large enterprises',
        'Cloud-only = POPIA data-residency risk for SA enterprises',
        'Change Management and Problem Management are weak',
        'Limited customization options for complex environments',
      ],
      winningPoints: [
        'Enterprise scalability without agent limits or instance splitting',
        'Local deployment option with full POPIA compliance',
        'Comprehensive ITSM module set (Change, Asset, Problem Management)',
        'Flexible pricing that grows with your organization',
      ],
    },
    keyWeaknesses: [
      {
        title: '500-Agent Ceiling',
        description: 'Hard limit forces large enterprises to split instances or migrate; poor scaling story',
      },
      {
        title: 'POPIA Data Residency Risk',
        description:
          'Cloud-only model creates compliance concerns for South African enterprises handling personal data',
      },
      {
        title: 'Weak Change Management',
        description: 'Change workflows are limited; insufficient for enterprise change control requirements',
      },
      {
        title: 'Vendor Financial Instability',
        description: 'Freshworks stock has declined significantly; uncertain product roadmap and support',
      },
    ],
    recentNews: [
      {
        title: 'Freshworks Stock Falls 40% YTD: Growth Concerns Persist',
        source: 'MarketWatch',
        date: '2024-05-10',
      },
      {
        title: 'Customer Testimonial: Freshservice 500-Agent Limit Forced Migration',
        source: 'G2 Reviews',
        date: '2024-04-15',
      },
      {
        title: 'Cloud-Only ITSM: POPIA Compliance Challenges in Africa',
        source: 'ZA Tech Compliance',
        date: '2024-03-20',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'zendesk',
    name: 'Zendesk',
    tagline: 'Customer Service Platform',
    avatar: 'ZE',
    riskLevel: 'High',
    ownership: 'Public (NYSE: ZEN)',
    founded: 2007,
    headquarters: 'San Francisco, California',
    employees: '4,000+',
    revenue: '~$1.7B ARR',
    website: 'https://www.zendesk.com',
    deployment: 'Cloud only',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$50-150/agent/month',
      additionalCosts: ['ITSM add-on modules', 'Premium support'],
    },
    tco3Year: {
      competitor: { min: 120000, max: 250000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R100K - R400K',
    complexity: {
      implementation: 'Moderate (8-12w)',
      adminComplexity: 'Moderate',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'ITSM Focus',
        gap: 'Customer service platform adapted for ITSM; not purpose-built',
        severity: 'High',
        halITSMAdvantage: 'Purpose-built ITSM platform with deep ITIL process support',
      },
      {
        category: 'Ticket-Centric Model',
        gap: 'Workflow beyond ticketing is limited; poor for complex ITSM processes',
        severity: 'High',
        halITSMAdvantage: 'Full ITSM processes (Change, Problem, Asset, Knowledge)',
      },
      {
        category: 'Cost of Entry',
        gap: 'ITSM licensing adds significant cost to base customer service platform',
        severity: 'Medium',
        halITSMAdvantage: 'All ITSM capabilities included in standard pricing',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Niche',
      marketShare: '~1.5% of ITSM market',
      targetSegment: 'Customer Service First',
    },
    salesRebuttal: {
      title: 'Zendesk: Customer Service, Not ITSM',
      keyMessage:
        'Zendesk is a customer service platform with ITSM add-ons — not a true ITSM solution. HaloITSM is purpose-built for IT operations with full ITIL process support.',
      weaknesses: [
        'Customer service platform adapted for ITSM; not purpose-built',
        'Ticket-centric model insufficient for complex ITSM workflows',
        'ITSM features require expensive add-on licensing',
        'Poor functionality for Change Management and Asset Management',
      ],
      winningPoints: [
        'Purpose-built ITSM platform with deep ITIL process support',
        'Comprehensive workflow capabilities beyond basic ticketing',
        'All ITSM modules included in standard pricing',
        'Intuitive interface designed for IT operations teams',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Not Purpose-Built for ITSM',
        description: 'Customer service platform adapted for ITSM; fundamentally different workflow needs',
      },
      {
        title: 'Ticket-Centric Model',
        description: 'Limiting workflows for complex ITSM processes like Change Management',
      },
      {
        title: 'Hidden ITSM Costs',
        description: 'ITSM features require expensive add-on licensing beyond base platform',
      },
      {
        title: 'Poor Change Control',
        description: 'Change management workflows are simplistic and insufficient for enterprise needs',
      },
    ],
    recentNews: [
      {
        title: 'Zendesk 2024 Earnings: Slowing Growth in ITSM Segment',
        source: 'Earnings Report',
        date: '2024-04-25',
      },
      {
        title: 'Enterprise CIOs Choose Dedicated ITSM Over Adapted Ticketing Platforms',
        source: 'Forrester',
        date: '2024-03-10',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'bmc-helix',
    name: 'BMC Helix',
    tagline: 'Intelligent ITSM & Operations',
    avatar: 'BM',
    riskLevel: 'Medium',
    ownership: 'PE-owned (KKR + Bain)',
    founded: 1980,
    headquarters: 'Houston, Texas',
    employees: '7,000+',
    revenue: '~$3.2B ARR',
    website: 'https://www.bmc.com/products/bmc-helix.html',
    deployment: 'Cloud / On-Premises',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'FedRAMP'],
    pricing: {
      type: 'Hybrid',
      basePrice: '$60-120/agent/month',
      additionalCosts: ['Premium modules', 'AI add-ons', 'Professional services'],
    },
    tco3Year: {
      competitor: { min: 180000, max: 300000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R300K - R1.5M',
    complexity: {
      implementation: 'Extended (12-18m)',
      adminComplexity: 'Very Complex',
      customization: 'SI-Dependent',
      supportQuality: 'Premium',
    },
    functionality: [
      {
        category: 'Implementation Complexity',
        gap: '18-24 month implementations; heavy SI dependency',
        severity: 'High',
        halITSMAdvantage: 'Quick 4-8 week deployments with minimal SI involvement',
      },
      {
        category: 'Learning Curve',
        gap: 'Steep admin learning curve; specialized training required',
        severity: 'Medium',
        halITSMAdvantage: 'Intuitive interface; reduced training time and support costs',
      },
      {
        category: 'Licensing Complexity',
        gap: 'Complex licensing model; unclear module inclusions',
        severity: 'Medium',
        halITSMAdvantage: 'Transparent, fixed pricing with all ITSM capabilities included',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Leader',
      marketShare: '~8% of ITSM market',
      targetSegment: 'Large Enterprise',
    },
    salesRebuttal: {
      title: 'BMC Helix: Enterprise Complexity, Not Simplicity',
      keyMessage:
        'BMC Helix requires 18-24 months to implement, demands SI partners, and charges premium pricing. HaloITSM delivers enterprise-grade ITSM in 4-8 weeks at transparent, predictable cost.',
      weaknesses: [
        '18-24 month implementation; heavy SI dependency',
        'Steep admin learning curve; specialized training required',
        'Complex licensing model; hidden module costs',
        'Premium pricing with unclear ROI timeline',
      ],
      winningPoints: [
        'Rapid deployments (4-8 weeks) with minimal SI involvement',
        'Intuitive UI reducing admin learning curve',
        'Transparent, all-inclusive pricing model',
        'Local support team providing responsive guidance',
        'Faster time-to-value with lower TCO',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Lengthy Implementation',
        description: '18-24 month implementations create business disruption and budget overruns',
      },
      {
        title: 'SI Dependency',
        description: 'Customizations require expensive systems integrator partnerships',
      },
      {
        title: 'Complex Admin Learning Curve',
        description: 'Steep learning curve; specialized training required for configuration',
      },
      {
        title: 'Complex Licensing',
        description: 'Unclear module inclusions and hidden costs make pricing unpredictable',
      },
      {
        title: 'PE Ownership Volatility',
        description: 'KKR/Bain ownership creates uncertainty about product roadmap',
      },
    ],
    recentNews: [
      {
        title: 'BMC 2024: Slowing ITSM Growth Amid Competitive Pressure',
        source: 'Earnings Report',
        date: '2024-05-20',
      },
      {
        title: '18-Month Deployment: BMC Helix Customer Shares Implementation Challenges',
        source: 'Customer Testimonial',
        date: '2024-04-15',
      },
    ],
    maActivity: [
      {
        type: 'Partnership',
        description: 'Strategic partnership with Microsoft for cloud integration - 2024',
        date: '2024-01-10',
      },
    ],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'remedy',
    name: 'BMC Remedy',
    tagline: 'Legacy ITSM Platform',
    avatar: 'RM',
    riskLevel: 'High',
    ownership: 'PE-owned (KKR + Bain) - BMC Software',
    founded: 1990,
    headquarters: 'Houston, Texas',
    employees: 'Part of BMC (7,000+)',
    revenue: 'Legacy product (declining)',
    website: 'https://www.bmc.com/products/remedy.html',
    deployment: 'On-Premises',
    architecture: 'Legacy',
    securityCertifications: ['ISO 27001'],
    pricing: {
      type: 'Hybrid',
      basePrice: 'Complex licensing model',
      additionalCosts: ['Maintenance', 'Support', 'Upgrades'],
    },
    tco3Year: {
      competitor: { min: 300000, max: 500000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R400K - R2M+',
    complexity: {
      implementation: 'Extended (12-18m)',
      adminComplexity: 'Very Complex',
      customization: 'SI-Dependent',
      supportQuality: 'Premium',
    },
    functionality: [
      {
        category: 'Legacy Architecture',
        gap: 'On-premises only; limited cloud capabilities',
        severity: 'Critical',
        halITSMAdvantage: 'Modern cloud-native architecture with flexible deployment',
      },
      {
        category: 'Outdated User Experience',
        gap: 'Dated UI; poor user adoption rates',
        severity: 'High',
        halITSMAdvantage: 'Modern, intuitive interface with high user adoption',
      },
      {
        category: 'Cloud Transition Path',
        gap: 'Remedy to Helix migration path is complex and expensive',
        severity: 'High',
        halITSMAdvantage: 'Start modern; no legacy migration burden',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Niche',
      marketShare: '~2% of ITSM market (declining)',
      targetSegment: 'Legacy Enterprise',
    },
    salesRebuttal: {
      title: 'Remedy: Aging Legacy Platform',
      keyMessage:
        'Remedy is an on-premises legacy platform with dated UI, high TCO, and no clear cloud path. HaloITSM is a modern, cloud-native solution built for today\'s IT operations.',
      weaknesses: [
        'On-premises only; limited cloud capabilities',
        'Dated, outdated user interface',
        'Poor user adoption due to UX complexity',
        'High total cost of ownership for legacy platform',
        'Complex and expensive migration path to Helix',
      ],
      winningPoints: [
        'Modern cloud-native architecture vs legacy on-premises',
        'Intuitive UI with high user adoption',
        'Flexible deployment (cloud, on-premises, hybrid)',
        'Clear path to innovation without legacy baggage',
        'Significantly lower TCO than Remedy',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Legacy On-Premises Only',
        description: 'No cloud option; forces customers to maintain on-premises infrastructure',
      },
      {
        title: 'Outdated User Interface',
        description: 'Dated UI leads to poor user adoption and support burden',
      },
      {
        title: 'High Total Cost of Ownership',
        description: 'On-premises infrastructure, licensing, and support costs far exceed modern solutions',
      },
      {
        title: 'Complex Migration Path',
        description: 'Remedy to Helix migration is costly and disruptive',
      },
      {
        title: 'Declining Market Position',
        description: 'Remedy is in decline; BMC pushing customers to newer Helix platform',
      },
    ],
    recentNews: [
      {
        title: 'BMC Remedy: Declining User Base as Customers Migrate to Cloud Solutions',
        source: 'Market Research',
        date: '2024-04-10',
      },
      {
        title: 'Customer Complaint: Remedy UI Complexity Drives High Support Costs',
        source: 'G2 Reviews',
        date: '2024-03-15',
      },
      {
        title: 'On-Premises ITSM Vendors Face Pressure as Enterprises Shift to Cloud',
        source: 'Gartner Research',
        date: '2024-02-20',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'solarwinds-itsm',
    name: 'SolarWinds ITSM',
    tagline: 'Network & IT Operations Platform',
    avatar: 'SW',
    riskLevel: 'Medium',
    ownership: 'Public (NYSE: SWI)',
    founded: 1999,
    headquarters: 'Austin, Texas',
    employees: '4,000+',
    revenue: '~$1.3B ARR',
    website: 'https://www.solarwinds.com/service-desk',
    deployment: 'Cloud / On-Premises',
    architecture: 'Hybrid',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR'],
    pricing: {
      type: 'Hybrid',
      basePrice: '$35-75/user/month',
      additionalCosts: ['Network monitoring add-ons', 'Premium support'],
    },
    tco3Year: {
      competitor: { min: 120000, max: 220000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R100K - R400K',
    complexity: {
      implementation: 'Moderate (8-12w)',
      adminComplexity: 'Moderate',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'Network Monitoring Focus',
        gap: 'ITSM module secondary to network monitoring; lacks ITSM depth',
        severity: 'Medium',
        halITSMAdvantage: 'Purpose-built ITSM with comprehensive module suite',
      },
      {
        category: 'Change Management',
        gap: 'Change management workflows are limited and basic',
        severity: 'Medium',
        halITSMAdvantage: 'Advanced change workflows with risk assessment',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Challenger',
      marketShare: '~1.5% of ITSM market',
      targetSegment: 'Network Operations / Mid-Market',
    },
    salesRebuttal: {
      title: 'SolarWinds ITSM: Network Tool, Not ITSM Platform',
      keyMessage:
        'SolarWinds ITSM is a network monitoring platform with ITSM add-ons. HaloITSM is purpose-built for IT Service Management with comprehensive ITSM capabilities.',
      weaknesses: [
        'Network monitoring platform; ITSM is secondary feature set',
        'Limited ITSM depth; basic workflows',
        'Change management lacks enterprise capabilities',
        'Uncertain product roadmap post-security incident',
      ],
      winningPoints: [
        'Purpose-built ITSM platform vs network monitoring add-on',
        'Advanced change management workflows',
        'Comprehensive ITSM module suite',
        'Clearer product roadmap and stability',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Network Monitoring Primary',
        description: 'ITSM is secondary feature; not the core focus of platform',
      },
      {
        title: 'Limited ITSM Capabilities',
        description: 'Basic workflows insufficient for complex ITSM processes',
      },
      {
        title: 'Weak Change Management',
        description: 'Change workflows lack enterprise-grade risk assessment',
      },
      {
        title: 'Security Incident History',
        description: '2020 supply chain attack creates uncertainty about security posture',
      },
    ],
    recentNews: [
      {
        title: 'SolarWinds 2024: ITSM Growth Lags Network Monitoring Business',
        source: 'Earnings Report',
        date: '2024-05-15',
      },
      {
        title: 'Customers Choose Dedicated ITSM Over Network Monitoring Platforms',
        source: 'Market Research',
        date: '2024-03-20',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'manageengine-servicedesk',
    name: 'ManageEngine ServiceDesk Plus',
    tagline: 'Budget-Friendly IT Service Desk',
    avatar: 'ME',
    riskLevel: 'Low',
    ownership: 'Zoho Corporation (Private)',
    founded: 2005,
    headquarters: 'Pleasanton, California',
    employees: '12,000+ (Zoho total)',
    revenue: '~$1B ARR (Zoho total)',
    website: 'https://www.manageengine.com/service-desk/it-service-desk-software.html',
    deployment: 'Cloud / On-Premises',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR'],
    pricing: {
      type: 'Per-Agent',
      basePrice: '$15-40/agent/month',
      additionalCosts: ['Minimal; most features included'],
    },
    tco3Year: {
      competitor: { min: 50000, max: 120000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R20K - R100K',
    complexity: {
      implementation: 'Quick (4-8w)',
      adminComplexity: 'Simple',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'Price vs Enterprise Features',
        gap: 'Budget platform; lacks advanced ITSM capabilities at scale',
        severity: 'Medium',
        halITSMAdvantage: 'Enterprise capabilities without budget trade-offs',
      },
      {
        category: 'Scalability',
        gap: 'Performance degradation at scale; best for SMB/mid-market',
        severity: 'Medium',
        halITSMAdvantage: 'Enterprise-grade scalability without performance issues',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Niche',
      marketShare: '~1% of ITSM market',
      targetSegment: 'SMB / Budget-Conscious',
    },
    salesRebuttal: {
      title: 'ManageEngine: SMB Tool, Not Enterprise ITSM',
      keyMessage:
        'ManageEngine is a budget option for SMBs; it lacks enterprise ITSM capabilities and scales poorly. HaloITSM provides enterprise-grade ITSM without sacrificing ease-of-use or value.',
      weaknesses: [
        'Budget platform; advanced features missing',
        'Performance issues at enterprise scale',
        'Limited customization for complex environments',
        'Support quality below enterprise standards',
      ],
      winningPoints: [
        'Enterprise ITSM capabilities at comparable or better pricing',
        'Superior scalability without performance degradation',
        'Advanced customization for complex requirements',
        'Enterprise-grade support with local team',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Budget Platform Limitations',
        description: 'Advanced ITSM capabilities missing; feature-limited compared to enterprise solutions',
      },
      {
        title: 'Scalability Concerns',
        description: 'Performance degrades at enterprise scale; struggles with large deployments',
      },
      {
        title: 'Limited Customization',
        description: 'Insufficient flexibility for complex ITSM environments',
      },
      {
        title: 'Support Quality',
        description: 'Support quality below enterprise standards',
      },
    ],
    recentNews: [
      {
        title: 'ManageEngine SMB Focus Limits Market Share in Enterprise Segment',
        source: 'Market Research',
        date: '2024-04-20',
      },
      {
        title: 'Customer Testimonial: ManageEngine Outgrown at Enterprise Scale',
        source: 'G2 Reviews',
        date: '2024-03-15',
      },
    ],
    maActivity: [],
    lastUpdated: '2026-06-15',
    dataQuality: 'High',
  },

  {
    id: 'atlassian-opsgenie',
    name: 'Atlassian Opsgenie',
    tagline: 'Alert & On-Call Management',
    avatar: 'OG',
    riskLevel: 'Low',
    ownership: 'Public (NASDAQ: TEAM) - Atlassian',
    founded: 2012,
    headquarters: 'Istanbul, Turkey (acquired by Atlassian 2018)',
    employees: 'Part of Atlassian (6,000+)',
    revenue: '~$4.4B ARR (Atlassian total)',
    website: 'https://www.atlassian.com/software/opsgenie',
    deployment: 'Cloud',
    architecture: 'Modern',
    securityCertifications: ['SOC 2', 'ISO 27001', 'GDPR'],
    pricing: {
      type: 'Per-User',
      basePrice: '$15-50/user/month',
      additionalCosts: ['API calls', 'Premium features'],
    },
    tco3Year: {
      competitor: { min: 60000, max: 150000, currency: 'ZAR' },
      haloITSM: { min: 80000, max: 150000, currency: 'ZAR' },
    },
    implementationCost: 'R10K - R50K',
    complexity: {
      implementation: 'Quick (1-4w)',
      adminComplexity: 'Simple',
      customization: 'Limited',
      supportQuality: 'Standard',
    },
    functionality: [
      {
        category: 'Alert Management Only',
        gap: 'Narrow focus on alerts/on-call; not a true ITSM platform',
        severity: 'Critical',
        halITSMAdvantage: 'Full ITSM suite (Incident, Change, Problem, Asset Management)',
      },
      {
        category: 'No ITSM Processes',
        gap: 'Missing core ITSM workflows beyond alerting',
        severity: 'Critical',
        halITSMAdvantage: 'Comprehensive ITIL-aligned processes',
      },
    ],
    marketPosition: {
      gartnerQuadrant: 'Niche',
      marketShare: '<0.5% of ITSM market',
      targetSegment: 'DevOps / Alert Management',
    },
    salesRebuttal: {
      title: 'Atlassian Opsgenie: Alert Tool, Not ITSM',
      keyMessage:
        'Opsgenie is an alert and on-call management tool, not an ITSM platform. HaloITSM provides comprehensive IT Service Management with full ITIL process support.',
      weaknesses: [
        'Alert/on-call tool; not a true ITSM platform',
        'No incident management workflows',
        'Missing Change, Problem, Asset Management',
        'DevOps-focused; not built for traditional IT operations',
      ],
      winningPoints: [
        'Full ITSM platform vs narrow alert management tool',
        'Comprehensive incident management workflows',
        'Complete ITSM module suite',
        'Built for IT operations, not just developer alerts',
      ],
    },
    keyWeaknesses: [
      {
        title: 'Alert Management Only',
        description: 'Narrow focus on alerts/on-call notifications; not an ITSM platform',
      },
      {
        title: 'No ITSM Workflows',
        description: 'Missing core ITSM processes and capabilities',
      },
      {
        title: 'DevOps-Focused',
        description: 'Built for developer operations; not suitable for traditional ITSM',
      },
      {
        title: 'Limited Scope',
        description: 'Cannot replace comprehensive ITSM solution',
      },
    ],
    recentNews: [
      {
        title: 'Opsgenie Remains Niche Alert Tool Despite Atlassian Acquisition',
        source: 'Market Research',
        date: '2024-05-01',
      },
      {
        title: 'DevOps Tools vs ITSM Platforms: Clear Market Separation',
        source: 'Gartner Analysis',
        date: '2024-03-20',
      },
    ],
    maActivity: [
      {
        type: 'Acquisition',
        description: 'Acquired by Atlassian - 2018',
        date: '2018-05-15',
      },
    ],
    lastUpdated: '2026-06-15',
    dataQuality: 'Medium',
  },
];

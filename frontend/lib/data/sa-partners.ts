import { SAPartner } from '@/lib/types/sa-partners';

export const SA_PARTNERS: SAPartner[] = [

  // ─── HALOITSM CHANNEL PARTNERS (same platform, competing for same contracts) ───

  {
    id: 'pink-elephant-sa',
    name: 'Pink Elephant South Africa',
    avatar: 'PE',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Primary',
    headquarters: 'Woodmead, Sandton',
    province: 'Gauteng',
    founded: 1984,
    employees: '50–200',
    website: 'https://www.pinkelephant.co.za/technology/haloitsm',
    tagline: 'Premier HaloITSM implementation partner in Africa',
    serviceDescription:
      'Pink Elephant is a globally established ITSM training and consulting firm (founded in Canada) with a South African office in Sandton. They position themselves as the "premier" HaloITSM implementation partner in Africa, with a focus on ITIL best practices, workflow automation, and ESM expansion beyond IT into HR, Facilities and Procurement.',
    keyServices: [
      'HaloITSM implementation and configuration',
      'ITIL process design and alignment',
      'Managed IT support services',
      'WorkWide Field Services integration',
      'Enterprise Service Management (ESM) expansion',
      'AI-driven workflow automation',
      'ITSM training and certification courses',
    ],
    targetSegment: 'Large enterprise, Sandton/Johannesburg corporates, multi-department ESM rollouts',
    strengths: [
      'Global Pink Elephant brand recognition (Canada-headquartered)',
      'Self-described "premier" HaloITSM partner in Africa',
      'Decades of ITSM experience and ITIL alignment',
      'Training academy adds credibility with CIOs and ITIL practitioners',
      'WorkWide Field Services ecosystem integration',
      'Strong AI/automation narrative on HaloITSM',
    ],
    weaknesses: [
      'Global corporate overhead drives higher day-rates and project costs',
      'Not a pure-play Halo partner — also resells Servicely and other tools',
      'Canadian HQ creates potential misalignment with SA regulatory context (POPIA, NIS Act)',
      'Training-first business model means implementation may be secondary priority',
      'Sandton corporate presence = higher cost base than regional players',
      'Broad ESM pitch can lose focus vs a targeted HaloITSM specialist',
      'No publicly stated HaloCRM or HaloPSA capability',
    ],
    stratwyzeAdvantages: [
      'Stratwyze is SA-born and SA-focused — no divided global loyalties',
      'Pure-play Halo partner: HaloITSM + HaloCRM + HaloPSA under one roof',
      'Lower cost base (Potchefstroom HQ) enables more competitive pricing',
      'POPIA and South African compliance embedded in our delivery model from day one',
      'No competing platform cross-sell risk — we do not resell Servicely or alternatives',
      'Stratwyze CRM provides end-to-end sales intelligence on top of HaloITSM implementation',
      'Faster implementation cycles with local, dedicated team',
    ],
    flankingStrategy: {
      situation:
        'Pink Elephant is shortlisted alongside Stratwyze for a HaloITSM implementation at a SA enterprise.',
      approach:
        'Position Stratwyze as the dedicated, cost-efficient SA specialist vs a global generalist with a training bias. Attack the overhead cost and the multi-product distraction.',
      keyMessage:
        'Pink Elephant brings global ITSM brand and ITIL training credibility — but their Canadian HQ, higher day-rates, and multi-platform focus means you are not their primary product. Stratwyze is a pure-play HaloITSM partner, SA-born, with a leaner cost structure and the full Halo suite including CRM and PSA.',
      talkingPoints: [
        'Ask: What percentage of Pink Elephant\'s revenue comes from HaloITSM vs ITIL training? You want a team that is all-in on Halo.',
        'Request itemised day-rates — Sandton corporate overhead will be reflected in their quotes.',
        'Pink Elephant also resells Servicely — ask them why, and what happens if Servicely is a better fit for you?',
        'Stratwyze is not just an ITSM implementer — we bring HaloCRM to align your sales and service delivery in one ecosystem.',
        'Our POPIA compliance advisory is built into every SA deployment — not an afterthought.',
      ],
      watchOut:
        'Pink Elephant\'s ITIL training credentials carry weight with ITIL-certified IT managers — acknowledge this, then pivot to delivery speed and total cost.',
    },
    typicalDealSize: 'R500K–R2M (large enterprise ESM rollouts)',
    salesCycle: '3–6 months',
    evidenceSources: [
      'https://www.pinkelephant.co.za/technology/haloitsm',
      'Self-described "premier implementation partner for HaloITSM in Africa"',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },

  {
    id: 'ipt-managed-services',
    name: 'IPT Managed Services',
    avatar: 'IT',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Primary',
    headquarters: 'Johannesburg',
    province: 'Gauteng',
    founded: 2014,
    employees: '51–200',
    website: 'https://ipt.za.com',
    tagline: 'Managed IT Services and Cybersecurity — with HaloITSM',
    serviceDescription:
      'IPT Managed Services is an SA-based MSP (Managed Service Provider) specialising in IT support and cybersecurity. They added HaloITSM to their portfolio as an official SA partner, but their primary identity is as a managed services and cybersecurity company — HaloITSM is a platform add-on, not their core practice. Operates across 5 SA cities.',
    keyServices: [
      'Managed IT support services',
      'Cybersecurity consulting and implementation',
      'HaloITSM implementation (as an add-on to MSP offering)',
      'Help desk outsourcing',
      'IT infrastructure management',
    ],
    targetSegment: 'SMB to mid-market, companies wanting outsourced IT support + ITSM tooling bundled',
    strengths: [
      'Established SA MSP brand since 2014 — strong Gauteng presence',
      'Multi-city footprint (5 cities across SA)',
      'Cybersecurity credentials add credibility with risk-conscious buyers',
      'Bundled MSP + HaloITSM model appeals to cost-conscious buyers wanting one vendor',
      'Official HaloITSM partner confirmation from HaloITSM Ltd',
    ],
    weaknesses: [
      'HaloITSM is a secondary product line — MSP operations are their core business',
      'Risk of divided attention: Halo implementations deprioritised when MSP tickets spike',
      'Cybersecurity and MSP focus means ITSM process depth may be shallow',
      'Bundling creates lock-in concern — customers may fear IPT as their only exit',
      'No public evidence of HaloCRM or HaloPSA capability',
      'SMB-focused MSP model limits enterprise ITSM credibility',
      'Limited ITIL process design or change management consulting depth',
    ],
    stratwyzeAdvantages: [
      'Stratwyze is dedicated to Halo — no MSP operations competing for resource and attention',
      'Full Halo ecosystem: ITSM + CRM + PSA — not just the ITSM module',
      'ITIL-aligned process consulting included, not bolted on',
      'No lock-in risk: Stratwyze implementation equips your team to self-manage',
      'SA-born and enterprise-focused — not an MSP that also sells software',
    ],
    flankingStrategy: {
      situation:
        'IPT is already the customer\'s managed services provider and is recommending HaloITSM as part of their MSP contract renewal.',
      approach:
        'Separate the MSP and ITSM decisions. Argue that best-of-breed ITSM implementation deserves a specialist, not a bundled add-on. Highlight the conflict of interest in an MSP also implementing the tool that measures MSP performance.',
      keyMessage:
        'Your MSP runs your IT — do you want that same company to implement and control the ITSM platform that measures their own SLA performance? Stratwyze delivers independent, objective HaloITSM implementations with no conflict of interest.',
      talkingPoints: [
        'ITSM tooling should be independent of your MSP — it is how you measure and govern them.',
        'IPT\'s HaloITSM practice launched recently — ask how many standalone ITSM implementations they have completed vs MSP bundled installs.',
        'With Stratwyze, you own the platform. We implement, train, and hand over — we do not need to be in the loop forever.',
        'Stratwyze also brings HaloCRM — aligning your IT and business service delivery in one view.',
      ],
      watchOut:
        'If IPT is deeply embedded as the customer\'s MSP, the relationship barrier is high. Lead with the governance/conflict-of-interest angle rather than feature comparison.',
    },
    typicalDealSize: 'R150K–R600K (bundled with MSP contracts)',
    salesCycle: '1–3 months (often piggybacked on MSP renewals)',
    evidenceSources: [
      'https://ipt.za.com/ipt-partners-with-haloitsm/',
      'HaloITSM confirmed IPT as official SA partner',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },

  {
    id: 'cyanxt',
    name: 'CyanXT',
    avatar: 'CX',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Primary',
    headquarters: 'South Africa',
    province: 'Unknown',
    website: 'https://www.cyanxt.com',
    tagline: 'HaloITSM, HaloPSA, HaloCRM — expert-driven solutions',
    serviceDescription:
      'CyanXT is a boutique SA consulting firm publicly stating partnership with the full Halo suite (HaloITSM, HaloPSA, HaloCRM). They position around ITSM, CSM (Customer Service Management) and ITOM, claiming 75+ years of combined team experience. Their website is Wix-hosted, indicating a small team operating as a specialist boutique.',
    keyServices: [
      'HaloITSM implementation and configuration',
      'HaloPSA and HaloCRM deployment',
      'ITSM process engineering and architecture advisory',
      'Customer Service Management (CSM)',
      'IT Operations Management (ITOM)',
      'Custom development on the Halo platform',
      'End-to-end Halo ecosystem delivery',
    ],
    targetSegment: 'Mid-market organisations requiring full Halo ecosystem deployment',
    strengths: [
      '75+ years of combined team experience — credible technical depth',
      'Full Halo suite capability: HaloITSM + HaloPSA + HaloCRM',
      'Process engineering and architecture advisory differentiates from pure install-and-go',
      'Boutique model enables focused client attention',
      'Custom development capability adds implementation flexibility',
    ],
    weaknesses: [
      'Wix-hosted website signals very small team — resource capacity concerns on large projects',
      'No clear HQ location or public team profile reduces enterprise buyer confidence',
      'Broad service scope (ITSM + CSM + ITOM) may dilute specialisation narrative',
      'No public case studies or reference clients visible',
      'Limited brand recognition vs Pink Elephant or Stratwyze',
      'Unknown financial stability and business maturity',
    ],
    stratwyzeAdvantages: [
      'Stratwyze has verifiable SA presence, registration (Reg. 2026/246323/07), and public mission',
      'Stratwyze\'s Stratwyze CRM platform (this tool) provides unique sales intelligence layer',
      'We publish case studies and maintain an active market presence',
      'Dedicated team with clear accountability and escalation paths',
      'Stratwyze combines Halo implementation expertise with sales and GTM consulting',
    ],
    flankingStrategy: {
      situation:
        'CyanXT is shortlisted alongside Stratwyze for a mid-market HaloITSM and HaloCRM deployment.',
      approach:
        'Compete on trust, track record, and commercial stability. A boutique with no public footprint is a risk on a mission-critical ITSM platform.',
      keyMessage:
        'CyanXT may carry strong technical credentials but a Wix website and no verifiable SA business registration raises questions about their long-term support capacity. Stratwyze is registered, insured, and committed to the SA market with a publicly accountable presence.',
      talkingPoints: [
        'Ask CyanXT for their company registration number, financials, and team size.',
        'Request three SA-based reference clients who can speak to their post-go-live support quality.',
        'Stratwyze offers the same full Halo suite — plus our Stratwyze CRM platform enhances your team\'s competitive intelligence and pipeline management.',
        'Implementation is the beginning — who supports you in month 13 when your contract ends?',
      ],
      watchOut:
        'Their "75 years combined experience" claim may land well with technical buyers. Counter with demonstrable SA delivery track record and named references.',
    },
    typicalDealSize: 'R200K–R800K',
    salesCycle: '2–4 months',
    evidenceSources: [
      'https://www.cyanxt.com — publicly states HaloITSM, HaloPSA, HaloCRM partnership',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },

  {
    id: 'facit-fixit',
    name: 'FacIT FixIT',
    avatar: 'FF',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Secondary',
    headquarters: 'South Africa',
    province: 'Unknown',
    website: 'https://linkedin.com',
    tagline: 'Halo Partner Network — South Africa',
    serviceDescription:
      'FacIT FixIT was announced as part of the official Halo Partner Network serving South Africa. Limited public information is available — their presence is primarily confirmed via LinkedIn announcement by HaloITSM. Likely a niche or early-stage SI focused on specific verticals.',
    keyServices: [
      'HaloITSM implementation (Halo Partner Network member)',
      'Facilities and IT service management (implied by company name)',
    ],
    targetSegment: 'Unknown — likely facilities management and IT crossover',
    strengths: [
      'Official Halo Partner Network recognition',
      'Potentially specialised in facilities + IT (FacIT = Facilities IT)',
    ],
    weaknesses: [
      'Minimal public presence — no dedicated website identified',
      'LinkedIn-only footprint raises legitimacy concerns for enterprise buyers',
      'Scope and team size unverified',
      'No public case studies, clients, or service descriptions',
      'Niche focus may limit breadth of ITSM delivery',
    ],
    stratwyzeAdvantages: [
      'Stratwyze has full public presence, registered company, and verifiable delivery history',
      'Broader Halo suite capability (ITSM + CRM + PSA)',
      'Dedicated sales and pre-sales support process',
    ],
    flankingStrategy: {
      situation: 'FacIT FixIT appears on a vendor shortlist for HaloITSM.',
      approach:
        'Simply outrun them on presence, process, and evidence. No flanking required — credibility gap does the work.',
      keyMessage:
        'A LinkedIn-only vendor without a public website or verifiable client list is not a safe choice for enterprise ITSM infrastructure. Stratwyze is registered, reference-able, and fully committed to the SA market.',
      talkingPoints: [
        'Request their company registration number and at least two enterprise reference clients.',
        'Ask for their implementation methodology documentation.',
        'Stratwyze provides a full pre-sales technical assessment and business case at no cost.',
      ],
      watchOut: 'They may win on price or personal relationships. Stay on track record and governance.',
    },
    typicalDealSize: 'Unknown',
    salesCycle: 'Unknown',
    evidenceSources: [
      'HaloITSM LinkedIn announcement confirming FacIT FixIT as Halo Partner Network member',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Medium',
  },

  {
    id: 'dsb-tech',
    name: 'DSB Tech Consultancy',
    avatar: 'DS',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Secondary',
    headquarters: 'South Africa',
    province: 'Unknown',
    website: 'https://linkedin.com',
    tagline: 'Halo Partner Network — South Africa',
    serviceDescription:
      'DSB Tech Consultancy was confirmed as part of the official Halo Partner Network via LinkedIn announcement. Similar to FacIT FixIT, they have minimal public presence beyond the LinkedIn confirmation. Likely a boutique technology consultancy operating in the SA mid-market.',
    keyServices: [
      'HaloITSM implementation (Halo Partner Network member)',
      'Technology consulting (implied)',
    ],
    targetSegment: 'Unknown — likely mid-market SA technology buyers',
    strengths: [
      'Official Halo Partner Network recognition',
      'Likely agile boutique model enabling competitive pricing',
    ],
    weaknesses: [
      'No public website or verifiable business presence',
      'LinkedIn-only footprint — enterprise governance risk',
      'Team size, capacity, and ITSM depth unverifiable',
      'No public service portfolio or case studies',
    ],
    stratwyzeAdvantages: [
      'Full public accountability, registration, and delivery process',
      'Stratwyze CRM + HaloITSM provides broader value proposition',
      'Documented implementation methodology and support SLAs',
    ],
    flankingStrategy: {
      situation: 'DSB Tech is shortlisted for a HaloITSM implementation.',
      approach: 'Win on credibility, methodology, and post-go-live support model.',
      keyMessage:
        'Enterprise ITSM cannot run on a vendor with no public footprint. Stratwyze brings documented process, registered presence, and post-implementation support built into every engagement.',
      talkingPoints: [
        'Request three reference clients and a sample Statement of Work.',
        'Demonstrate Stratwyze\'s implementation methodology and post-go-live SLA.',
        'Highlight that Stratwyze also brings HaloCRM for the sales team — a complete Halo ecosystem play.',
      ],
      watchOut: 'Price may be their differentiator. Be prepared to defend TCO and support costs.',
    },
    typicalDealSize: 'Unknown',
    salesCycle: 'Unknown',
    evidenceSources: ['HaloITSM LinkedIn announcement confirming DSB Tech as Halo Partner Network member'],
    lastVerified: '2026-06-21',
    dataConfidence: 'Medium',
  },

  {
    id: 'equacore',
    name: 'EquaCore',
    avatar: 'EQ',
    category: 'HaloITSM Channel Partner',
    platformAlignment: 'HaloITSM',
    threatLevel: 'Emerging',
    headquarters: 'South Africa',
    province: 'Unknown',
    website: 'https://instagram.com',
    tagline: 'Official Halo Partner — South Africa (unverified)',
    serviceDescription:
      'EquaCore lists themselves as an official Halo partner on social media (Instagram). Evidence is limited to social listing only — requires direct verification before treating as an active competitor.',
    keyServices: ['HaloITSM (unverified partnership scope)'],
    targetSegment: 'Unknown',
    strengths: ['Claimed Halo partner status'],
    weaknesses: [
      'Only Instagram evidence — not confirmed via official Halo partner directory or website',
      'No public website, service portfolio, or verifiable team',
      'Social-media only presence is insufficient for enterprise credibility',
    ],
    stratwyzeAdvantages: [
      'Verified, confirmed Halo partner with full public presence',
      'No comparison needed if EquaCore cannot provide enterprise-grade credentials',
    ],
    flankingStrategy: {
      situation: 'EquaCore appears on a customer\'s vendor research list.',
      approach: 'Let their own lack of verifiable presence do the work.',
      keyMessage:
        'Instagram evidence of a Halo partnership is not the same as verified Halo partner status. Always request official partner confirmation directly from HaloITSM Ltd.',
      talkingPoints: [
        'Suggest the customer verify partner status at haloitsm.com/partners.',
        'An Instagram listing is not a business registration or official partner agreement.',
      ],
      watchOut: 'Do not over-focus on them — they may not be an active competitor at all.',
    },
    evidenceSources: ['Instagram social listing claiming Halo partner status'],
    lastVerified: '2026-06-21',
    dataConfidence: 'Unverified',
  },

  // ─── COMPETING PLATFORM PARTNERS (different platforms, same ITSM budget) ───

  {
    id: 'think-tank-software',
    name: 'Think Tank Software Solutions',
    avatar: 'TT',
    category: 'Competing Platform Partner',
    platformAlignment: 'Ivanti',
    threatLevel: 'Primary',
    headquarters: 'Johannesburg',
    province: 'Gauteng',
    website: 'https://www.thinktanks.co.za',
    tagline: 'Ivanti Premier Partner in South Africa',
    serviceDescription:
      'Think Tank Software Solutions is a long-established SA enterprise software and consulting firm. They hold Ivanti Premier Partner status in South Africa, selling Ivanti Neurons ITSM, ESM, ITAM (IT Asset Management), Hyperautomation, and Digital Employee Experience. They compete directly for enterprise ITSM budgets where Stratwyze positions HaloITSM.',
    keyServices: [
      'Ivanti Neurons ITSM and ESM implementation',
      'IT Asset Management (ITAM)',
      'Digital Employee Experience (DEX) solutions',
      'Hyperautomation and AI agent workflows',
      'Enterprise integration and process automation',
      'Managed Ivanti support services (SLA-backed)',
    ],
    targetSegment: 'Large enterprise, Johannesburg/Gauteng, ITSM + ITAM combined projects',
    strengths: [
      'Ivanti Premier Partner status — highest reseller tier',
      'Long-established SA presence and enterprise relationships',
      'ITAM + ITSM combined offering appeals to asset-heavy enterprises',
      'Hyperautomation and AI agent narrative aligns with modern buyer priorities',
      'SLA-backed managed support differentiates from pure implementation partners',
    ],
    weaknesses: [
      'They are selling Ivanti Neurons — a CISA 2024 security-advisory platform',
      'Ivanti forces costly Cherwell migrations on existing customers',
      'Ivanti PE ownership (Clearlake Capital) creates roadmap uncertainty',
      'Ivanti 3YR TCO is R3–8M vs HaloITSM R4–8M — minimal savings with higher risk',
      'Ivanti support quality has degraded significantly post-acquisition',
      'Think Tank is locked into Ivanti — cannot objectively recommend alternatives',
      'Complex, lengthy Ivanti implementations (12–18 months) vs HaloITSM 4–8 weeks',
    ],
    stratwyzeAdvantages: [
      'HaloITSM has no CISA security advisories or CVEs — clean security record',
      'HaloITSM 4–8 week implementation vs Ivanti\'s 12–18 months',
      'No Cherwell migration burden — modern cloud-native architecture from day one',
      'HaloITSM + HaloCRM + HaloPSA = full suite vs Ivanti\'s ITSM-only play',
      'Stratwyze is platform-agnostic enough to give honest advice; Think Tank is not',
      'Clearer product roadmap with Halo\'s UK-based, privately owned, stable structure',
    ],
    flankingStrategy: {
      situation:
        'Think Tank is pitching Ivanti Neurons to a prospect who is also evaluating HaloITSM via Stratwyze.',
      approach:
        'Lead with the CISA advisory and Ivanti\'s security risk. Then attack the TCO and implementation timeline. Let the prospect realise Think Tank cannot give objective advice.',
      keyMessage:
        'Think Tank is a committed Ivanti Premier Partner — they cannot recommend any other platform regardless of fit. Ivanti carries a CISA 2024 security advisory and forces costly Cherwell migrations. HaloITSM delivers the same enterprise capability in 4–8 weeks with a clean security record and transparent pricing.',
      talkingPoints: [
        'Pull up the CISA 2024 advisory on Ivanti Neurons — ask Think Tank how their customer handles POPIA compliance with a flagged platform.',
        'Ivanti recently forced all Cherwell customers to migrate — with no choice and at their own cost. Ask if the prospect is comfortable with that precedent.',
        'Request a head-to-head TCO comparison: Ivanti vs HaloITSM over 3 years including implementation, licensing, and support.',
        'Think Tank\'s Ivanti Premier status means they earn the most margin on Ivanti. Ask them: if HaloITSM was a better fit, would they tell you?',
        'HaloITSM goes live in 4–8 weeks. Ask Think Tank for their Ivanti implementation timeline.',
      ],
      watchOut:
        'Think Tank has deep enterprise relationships in Gauteng. Their ITAM credentials are strong — if asset management is the primary requirement, acknowledge that and compete on ITSM + total platform value.',
    },
    typicalDealSize: 'R500K–R3M (Ivanti enterprise deployments)',
    salesCycle: '3–9 months',
    evidenceSources: [
      'https://www.thinktanks.co.za — Ivanti Premier Partner, SA',
      'ITWeb listing: Think Tank Software Solutions — Ivanti ITSM/ESM partner',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },

  {
    id: 'itr-technology',
    name: 'ITR Technology',
    avatar: 'IR',
    category: 'Competing Platform Partner',
    platformAlignment: 'ManageEngine',
    threatLevel: 'Secondary',
    headquarters: 'Centurion, Highveld Techno Park',
    province: 'Gauteng',
    website: 'https://itrtech.africa',
    tagline: 'Exclusive ManageEngine distributor in South Africa',
    serviceDescription:
      'ITR Technology holds the exclusive ManageEngine distribution rights for South Africa. Based in Centurion (13 Esdoring Nook, Highveld Techno Park, Gauteng), they resell ManageEngine ServiceDesk Plus and the full Zoho/ManageEngine portfolio including ESM, IAM (Identity and Access Management), and Analytics tools. They compete primarily for budget-sensitive and mid-market ITSM buyers.',
    keyServices: [
      'ManageEngine ServiceDesk Plus (ITSM)',
      'Enterprise Service Management (ESM)',
      'Identity and Access Management (IAM)',
      'IT Analytics and reporting',
      'Cloud solutions and MSP tooling',
      'ManageEngine licensing, distribution, and support',
    ],
    targetSegment: 'Budget-conscious mid-market and SMB buyers, MSPs, companies seeking low-cost ITSM',
    strengths: [
      'Exclusive SA distributor = no competing resellers on ManageEngine price',
      'ManageEngine is significantly cheaper than enterprise alternatives',
      'Full Zoho/ManageEngine ecosystem (CRM, Analytics, IAM) creates bundling opportunities',
      'Centurion presence serves Pretoria/Tshwane corporate market well',
      'Low-barrier entry pricing wins SMB and cost-pressured buyers',
    ],
    weaknesses: [
      'ManageEngine is a budget platform — performance degrades at enterprise scale',
      'ServiceDesk Plus lacks advanced Change Management and enterprise workflows',
      'ManageEngine has had notable security vulnerabilities (CVE history)',
      'POPIA compliance architecture on ManageEngine cloud not as robust as alternatives',
      'As exclusive distributor, ITR Technology cannot recommend better-fit alternatives',
      'Limited enterprise customisation and integration capability',
      'Zoho/ManageEngine is India-headquartered — no SA data centre option',
    ],
    stratwyzeAdvantages: [
      'HaloITSM scales to any enterprise size — no performance ceiling',
      'Advanced Change Management, Asset, and Problem Management built in',
      'Flexible deployment (cloud or on-premises) with SA data residency option',
      'Cleaner security record and regular proactive CVE management',
      'HaloCRM + HaloPSA extends the platform into sales and project delivery',
      'We compete on total business value, not lowest licensing price',
    ],
    flankingStrategy: {
      situation:
        'A prospect is evaluating ManageEngine via ITR Technology on cost grounds against HaloITSM.',
      approach:
        'Compete on TCO and 3-year growth story, not licensing price. Show that ManageEngine\'s low entry cost becomes expensive when they outgrow it.',
      keyMessage:
        'ManageEngine is the right tool for a small IT team with a tight budget. If you plan to grow beyond 100 agents, manage complex change processes, or need POPIA-compliant SA data residency, you will outgrow ManageEngine faster than the savings justify.',
      talkingPoints: [
        'Ask what their IT team headcount and ticket volume looks like in 3 years — ManageEngine degrades at scale.',
        'ManageEngine Change Management is basic. If they run change advisory boards (CAB) or ITIL change workflows, ManageEngine will frustrate them.',
        'ManageEngine is hosted out of India — ask their legal/compliance team about POPIA and cross-border data transfer.',
        'The license cost gap closes significantly once you factor in implementation, customisation, and re-implementation when they outgrow it.',
        'HaloITSM starts competitive and stays competitive as you grow — no painful migration.',
      ],
      watchOut:
        'Price is ITR Technology\'s entire pitch. Do not engage in a license-fee race. Stay on 3-year TCO, scalability, and compliance.',
    },
    typicalDealSize: 'R30K–R300K (SMB/mid-market ManageEngine deployments)',
    salesCycle: '1–3 months',
    evidenceSources: [
      'https://itrtech.africa — exclusive ManageEngine distributor, Centurion, Gauteng',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },

  {
    id: 'mediro-bsm',
    name: 'Mediro Business Service Management',
    avatar: 'MB',
    category: 'Competing Platform Partner',
    platformAlignment: 'ServiceNow',
    threatLevel: 'Primary',
    headquarters: 'South Africa',
    province: 'Gauteng',
    website: 'https://servicenow.com/partners',
    tagline: 'ServiceNow partner — service management, IT operations and security',
    serviceDescription:
      'Mediro Business Service Management is a South African ServiceNow partner focused on service management, IT operations, and security. They compete at the large enterprise level for the same ITSM budgets where Stratwyze positions HaloITSM. ServiceNow deals they win typically run 12–18 months and R250K–500K in total cost, significantly above HaloITSM.',
    keyServices: [
      'ServiceNow ITSM and ITOM implementation',
      'Security Operations (SecOps) on ServiceNow',
      'IT operations and monitoring integration',
      'ServiceNow configuration and customisation',
    ],
    targetSegment: 'Large enterprise, Johannesburg-based corporates, multi-module ServiceNow deployments',
    strengths: [
      'ServiceNow brand carries weight with CIOs and enterprise procurement',
      'Broad ServiceNow module coverage (ITSM + ITOM + SecOps)',
      'Enterprise-level credibility through ServiceNow partner certification',
    ],
    weaknesses: [
      'ServiceNow implementations run 12–18 months — very long time-to-value',
      'ServiceNow cloud-only = POPIA data-residency risk for SA enterprises',
      'ServiceNow 3YR TCO is R250–500K — 3–4x more expensive than HaloITSM',
      'SI-dependent model: customers need Mediro (or another SI) permanently',
      'Platform complexity creates high admin overhead and staff training costs',
      'ServiceNow\'s complexity often leads to scope creep and budget overruns',
      'Mediro is commercially incentivised by ServiceNow margin — not platform-neutral',
    ],
    stratwyzeAdvantages: [
      'HaloITSM goes live in 4–8 weeks vs ServiceNow 12–18 months',
      'HaloITSM 3YR TCO is R80–150K vs ServiceNow R250–500K',
      'POPIA-compliant SA deployment option from day one',
      'Stratwyze trains and empowers your team to self-manage — no permanent SI dependency',
      'HaloITSM + HaloCRM unifies IT service delivery and business development in one platform',
    ],
    flankingStrategy: {
      situation:
        'A large enterprise is considering ServiceNow via Mediro alongside HaloITSM via Stratwyze.',
      approach:
        'Win on speed-to-value and total cost. Large enterprises get attached to ServiceNow brand — undercut that attachment with a realistic implementation timeline and TCO comparison.',
      keyMessage:
        'ServiceNow is a powerful platform — but your organisation will spend 12–18 months implementing it, R500K+ in the first three years, and still need Mediro on retainer to manage it. HaloITSM delivers the same enterprise ITSM capability in 4–8 weeks at a third of the cost, with your team empowered to own it.',
      talkingPoints: [
        'Request a side-by-side 3-year TCO: ServiceNow (via Mediro) vs HaloITSM (via Stratwyze), including implementation, licensing, support, and training.',
        'ServiceNow is cloud-only. Ask their legal team about POPIA compliance and data sovereignty.',
        'How many ServiceNow features will you actually use? Unused features still cost you licensing fees.',
        'HaloITSM has a Gartner-recognised enterprise feature set at a mid-market price point.',
        'Ask Mediro: when the implementation is done, what does your monthly retainer look like?',
      ],
      watchOut:
        'ServiceNow is the prestige choice — some CIOs choose it for career protection ("no one gets fired for buying ServiceNow"). Frame HaloITSM as the modern, decisive choice for SA enterprises that prioritise outcomes over brand.',
    },
    typicalDealSize: 'R500K–R2M+ (ServiceNow enterprise rollouts)',
    salesCycle: '6–12 months',
    evidenceSources: ['ServiceNow partner profile listing for Mediro Business Service Management'],
    lastVerified: '2026-06-21',
    dataConfidence: 'High',
  },

  {
    id: 'nexio-sa',
    name: 'Nexio South Africa',
    avatar: 'NX',
    category: 'Competing Platform Partner',
    platformAlignment: 'ServiceNow',
    threatLevel: 'Primary',
    headquarters: 'Johannesburg',
    province: 'Gauteng',
    website: 'https://nexio.co.za',
    tagline: 'ServiceNow OEM Reseller and Service Provider',
    serviceDescription:
      'Nexio is a large SA ICT company operating as a ServiceNow OEM Reseller and Service Provider. They bring significant market presence, established SA enterprise relationships, and ServiceNow\'s full platform credibility to large deals. Their scale means they compete at the top of the enterprise ITSM market and are a serious threat in large Gauteng accounts.',
    keyServices: [
      'ServiceNow OEM reselling and licensing',
      'ServiceNow ITSM, ITOM, and CSM implementation',
      'Enterprise ICT managed services',
      'Digital transformation consulting',
      'Network and connectivity services',
    ],
    targetSegment: 'Large enterprise and government, SA-wide, multi-module ServiceNow deployments',
    strengths: [
      'Large established SA ICT company — deep enterprise relationships',
      'ServiceNow OEM Reseller = direct commercial relationship with ServiceNow',
      'Scale and resources to run large, complex implementations',
      'Government and parastatal relationships add public sector credibility',
      'Strong Gauteng and national footprint',
    ],
    weaknesses: [
      'ServiceNow complexity and cost remains the primary barrier (R250–500K 3YR TCO)',
      'OEM Reseller model means Nexio is commercially locked into ServiceNow pricing',
      'Large company = slower response times, less agile for mid-market',
      'POPIA data residency risk on ServiceNow cloud-only model',
      'Implementation timelines of 12–18 months are standard on ServiceNow',
      'Nexio\'s breadth (networking, connectivity, ICT) dilutes ITSM depth vs specialists',
    ],
    stratwyzeAdvantages: [
      'Stratwyze is a dedicated ITSM specialist — not a generalist ICT company',
      'HaloITSM total cost is 3–4x less than ServiceNow over three years',
      'Faster implementation with dedicated SA team',
      'POPIA-first deployment approach built into Stratwyze\'s delivery model',
      'Mid-market and enterprise buyers get senior attention — not junior resources on a large account',
    ],
    flankingStrategy: {
      situation:
        'Nexio is competing for a large enterprise or government ITSM tender with ServiceNow.',
      approach:
        'Compete on speed, cost, and SA-fit. Nexio and ServiceNow represent the heavyweight incumbent model. Position HaloITSM as the modern, outcome-focused alternative that respects SA procurement realities.',
      keyMessage:
        'Nexio and ServiceNow are the most expensive path to ITSM. For the same capability — or better — HaloITSM via Stratwyze delivers in a quarter of the time, at a third of the cost, with a SA-dedicated team focused entirely on your outcome.',
      talkingPoints: [
        'In a tender, include a 3-year TCO comparison showing Nexio/ServiceNow vs HaloITSM/Stratwyze.',
        'ServiceNow\'s cloud-only model conflicts with government and parastatal data sovereignty requirements.',
        'Nexio is primarily a network and connectivity company — how specialised is their ITSM implementation practice?',
        'HaloITSM has ITIL 4-aligned feature parity with ServiceNow at a fraction of the price.',
        'Reference the POPIA compliance risk with a cloud-only US-hosted platform.',
      ],
      watchOut:
        'Nexio has deep government and parastatal relationships. If procurement is relationship-driven, focus on TCO, POPIA compliance, and functionality parity — not relationship strength.',
    },
    typicalDealSize: 'R1M–R5M+ (large enterprise and government ServiceNow deals)',
    salesCycle: '6–18 months (including tender processes)',
    evidenceSources: ['LinkedIn announcement: Nexio South Africa — ServiceNow OEM Reseller and Service Provider'],
    lastVerified: '2026-06-21',
    dataConfidence: 'High',
  },

  {
    id: 'scon-consultants',
    name: 'S Con System Consultants',
    avatar: 'SC',
    category: 'Competing Platform Partner',
    platformAlignment: 'Freshservice',
    threatLevel: 'Secondary',
    headquarters: 'South Africa',
    province: 'Unknown',
    website: 'https://www.scon.co.za',
    tagline: 'Freshworks Partner — Freshservice ITSM implementation',
    serviceDescription:
      'S Con System Consultants is a South African Freshworks partner focused on Freshservice ITSM implementations. They compete in the mid-market segment against HaloITSM, primarily on the basis of Freshservice\'s lower entry price and simpler setup. Their Wix-hosted website indicates a boutique operation.',
    keyServices: [
      'Freshservice ITSM implementation',
      'Freshworks platform consulting',
      'Help desk setup and configuration',
      'ITSM process design on Freshservice',
    ],
    targetSegment: 'Mid-market and cost-conscious buyers seeking simple cloud ITSM',
    strengths: [
      'Freshservice has a lower entry-level price than HaloITSM',
      'Quick setup — Freshservice can be live in days for simple configurations',
      'Freshworks suite (Freshsales, Freshdesk, Freshservice) enables cross-sell',
      'SA-based partner provides local support advantage',
    ],
    weaknesses: [
      'Freshservice has a hard 500-agent ceiling — enterprise growth is blocked',
      'Cloud-only = POPIA data residency risk for SA enterprises',
      'Freshworks listed on NASDAQ — financial instability concerns (stock declined 40%+ YTD)',
      'Weak Change Management and Problem Management modules',
      'No on-premises deployment option for regulated industries',
      'S Con has no verifiable enterprise reference clients on public record',
      'Wix website indicates very small boutique team — capacity risk on complex projects',
    ],
    stratwyzeAdvantages: [
      'HaloITSM scales beyond 500 agents without instance splitting',
      'On-premises deployment option for regulated SA industries (financial services, government)',
      'HaloITSM Change and Problem Management is enterprise-grade',
      'Stable, UK-based vendor vs NASDAQ-listed Freshworks with declining stock',
      'Stratwyze brings HaloCRM and HaloPSA — S Con only offers Freshservice',
    ],
    flankingStrategy: {
      situation:
        'S Con is pitching Freshservice to a prospect on the basis of lower price and quick setup.',
      approach:
        'Compete on growth trajectory, POPIA compliance, and enterprise capabilities. Let them win the SMB deals — go after the accounts that will grow.',
      keyMessage:
        'Freshservice is a fast, affordable way to get started — but if you plan to grow beyond 100 agents or need POPIA-compliant SA data residency, you will hit a ceiling and face a painful migration. HaloITSM gives you enterprise capability from day one at a price that stays competitive as you scale.',
      talkingPoints: [
        'Ask how many agents they plan to have in 3 years — Freshservice has a hard 500-agent limit.',
        'Freshworks stock has declined over 40% YTD — ask S Con about their vendor\'s financial stability.',
        'POPIA: Freshservice cloud-only means your data lives outside South Africa. Have they addressed this with your compliance team?',
        'Freshservice Change Management is basic — if they run formal change advisory boards, it will fall short quickly.',
        'HaloITSM pricing is competitive with Freshservice at scale — get a like-for-like quote.',
      ],
      watchOut:
        'Freshservice is genuinely easy to use and low-cost entry. Do not dismiss it — acknowledge the quick-win appeal, then redirect to the growth risk.',
    },
    typicalDealSize: 'R30K–R200K (mid-market Freshservice deployments)',
    salesCycle: '1–2 months',
    evidenceSources: [
      'https://www.scon.co.za/freshservice — Freshworks partner, Freshservice implementation',
    ],
    lastVerified: '2026-06-21',
    dataConfidence: 'Confirmed',
  },
];

// Cheeky research commentary to keep sales reps entertained

export const RESEARCH_PHASES = {
  START: [
    "🔍 Putting on our detective hat...",
    "🕵️ Preparing to stalk... ethically... on the internet",
    "📡 Pinging the internet gods for intelligence...",
    "🎯 Locking onto target. Deploying search drones...",
    "🚀 Activating research mode. This is not a drill.",
  ],

  WEB_SEARCH: [
    "🌐 Googling like we're cramming for an exam",
    "📰 Reading their website. Plot twist: they say they're 'innovative'",
    "🔎 Scanning the web for anything interesting...",
    "📄 Pulling up their about page (because we're thorough)",
    "💼 Digging through their digital footprint",
    "🕸️ Crawling the web for intel (the legal kind)",
  ],

  NEWS: [
    "📢 Checking what they've been bragging about in press releases",
    "🗞️ Hunting for recent news (good, bad, or interesting)",
    "📺 Scanning headlines. Oooh, a new funding round?",
    "🔔 Checking their news feed. Any scandals? Launches?",
    "📻 Listening to what the industry is saying about them",
    "🎙️ Eavesdropping on the industry chatter (responsibly)",
  ],

  LINKEDIN: [
    "💼 Sneaking a peek at their LinkedIn (the professional kind of stalking)",
    "👥 Analyzing their team. Are they hiring? Growing? Panicking?",
    "📊 Checking their headcount trends. Size matters (or does it?)",
    "🎓 Learning about their leadership team",
    "💡 Seeing who they're recruiting (tells us what they're building)",
    "🤝 Understanding their org structure from their hiring spree",
  ],

  MA: [
    "💰 Investigating their M&A moves. Any acquisitions brewing?",
    "🏦 Checking for funding rounds or IPO whispers",
    "📈 Looking for acquisition activity (who they're buying matters)",
    "💎 Hunting for investment signals (growth = budget)",
    "🎁 Checking if anyone's tried to buy them",
  ],

  REVENUE: [
    "💵 Reverse-engineering their revenue from SEC filings",
    "📊 Checking industry databases for revenue estimates",
    "🏭 Analyzing their operations to guess revenue tier",
    "💸 Looking up their financial health (is this a risky deal?)",
    "📉 Understanding their financial trajectory",
  ],

  JSE: [
    "🏛️ Checking if they're listed on JSE (yes, the Johannesburg Stock Exchange matters!)",
    "📊 Pulling market data. Stock price tells a story.",
    "💹 Checking their market cap (big money = big decisions)",
    "📈 Analyzing their 52-week performance",
  ],

  SYNTHESIS: [
    "🧠 Teaching AI to think about what we found...",
    "💭 Connecting the dots. Generating insights...",
    "✨ Synthesizing intelligence into something useful",
    "🎨 Painting a picture of this company",
    "🔮 Channeling our inner fortune teller to guess their pain points",
  ],
};

export const INTERESTING_FACTS = [
  "Fun fact: Companies that hire fast tend to have budget approved too.",
  "Did you know? News mentions correlate with strategic initiatives.",
  "Plot twist: Their LinkedIn hiring tells you what they're building.",
  "Insider tip: M&A activity = budget available for new tech.",
  "Reality check: Large headcount ≠ large IT budget.",
  "Pro tip: Check their job postings. What roles are they hiring?",
  "Easter egg: Their 'About Us' page never mentions their real problems.",
  "Spoiler alert: Funding = proof they're planning something big.",
  "Breaking news: Nobody's website mentions how much tech debt they have.",
  "Theory: The glossier their website, the worse their actual processes.",
];

export const FUNNY_OBSERVATIONS = [
  "Their website has a lot of stock photography. Interesting choice.",
  "Their about page says they're 'disrupting the industry'. Of course it does.",
  "Fun observation: They haven't updated their leadership team photo in 3 years.",
  "Awkward: Their website says they're 'cloud-first' but no cloud platforms found.",
  "Reality: Their job postings suggest they're desperate for engineers.",
  "Plot twist: Their news mentions they just switched platforms... again.",
  "Yikes: Their last press release was 18 months ago.",
  "Interesting: They're hiring like crazy. Something's up.",
  "Translation: 'Digital transformation journey' = 'our systems are old'.",
  "What they say: 'Leveraging cutting-edge tech'  |  What we found: Legacy stack",
];

export const MOTIVATIONAL_QUOTES = [
  "You miss 100% of the deals you don't research. — Wayne Gretzky — Michael Scott",
  "Intelligence is power. So is a good sales call.",
  "They did their homework on us. Let's return the favor.",
  "A prepared rep closes faster. You're doing great.",
  "Intel > luck. You're on the right track.",
  "This research is about to make your sales call 10x better.",
  "You're about to walk into that call more prepared than they expect.",
  "Knowledge is your secret weapon. You're loading up.",
];

export const DEAL_STAGE_COMMENTARY = {
  PROSPECTING: [
    "First impressions matter. Let's make a great one with intel.",
    "You're about to call cold. Let's warm them up with what we know.",
    "Initial outreach is easier when you know their story.",
  ],
  QUALIFICATION: [
    "Discovery call prep complete. You're ready.",
    "You're about to ask smarter questions because you did your homework.",
    "Let's turn their pain points into an opportunity.",
  ],
  SOLUTIONING: [
    "Demo time. But first, let's understand what matters to them.",
    "You're about to show them we 'get it'. Because we do.",
    "Solution design starts with understanding. We're there.",
  ],
  PROPOSAL: [
    "Proposal time. Make it personal. We've got the intel.",
    "Custom messaging incoming. Their pain points matter most.",
    "Let's show them we did our homework. They'll notice.",
  ],
};

export function getRandomCommentary(phase: keyof typeof RESEARCH_PHASES): string {
  const options = RESEARCH_PHASES[phase];
  return options[Math.floor(Math.random() * options.length)];
}

export function getRandomFact(): string {
  return INTERESTING_FACTS[Math.floor(Math.random() * INTERESTING_FACTS.length)];
}

export function getRandomObservation(): string {
  return FUNNY_OBSERVATIONS[Math.floor(Math.random() * FUNNY_OBSERVATIONS.length)];
}

export function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function getStageCommentary(stage: 'PROSPECTING' | 'QUALIFICATION' | 'SOLUTIONING' | 'PROPOSAL'): string {
  const options = DEAL_STAGE_COMMENTARY[stage];
  return options[Math.floor(Math.random() * options.length)];
}

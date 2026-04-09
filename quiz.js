// ExpatAce Quiz Engine
// 12 questions, city-level scoring, dual entry points

// ── EDUCATION DATA — PISA 2022 (Math + Reading + Science average) ───
// Source: OECD PISA 2022 Results, published December 2023
// Tier: 5=Exceptional, 4=Strong, 3=Good, 2=Developing, 1=Limited data
const EDUCATION = {
  'Japan':              {tier:5, score:523, label:'Exceptional', note:'#3 globally — PISA 2022'},
  'South Korea':        {tier:5, score:527, label:'Exceptional', note:'#2 globally — PISA 2022'},
  'Germany':            {tier:4, score:475, label:'Strong',      note:'Top 15 globally — PISA 2022'},
  'France':             {tier:4, score:474, label:'Strong',      note:'Top 20 globally — PISA 2022'},
  'United Kingdom':     {tier:4, score:484, label:'Strong',      note:'Top 15 globally — PISA 2022'},
  'Australia':          {tier:4, score:487, label:'Strong',      note:'Top 15 globally — PISA 2022'},
  'New Zealand':        {tier:4, score:481, label:'Strong',      note:'Top 15 globally — PISA 2022'},
  'Canada':             {tier:4, score:497, label:'Strong',      note:'Top 10 globally — PISA 2022'},
  'Spain':              {tier:3, score:474, label:'Good',        note:'OECD average — PISA 2022'},
  'Portugal':           {tier:3, score:472, label:'Good',        note:'Near OECD average — PISA 2022'},
  'Italy':              {tier:3, score:462, label:'Good',        note:'OECD average — PISA 2022'},
  'Croatia':            {tier:3, score:456, label:'Good',        note:'EU average — PISA 2022'},
  'Czech Republic':     {tier:3, score:489, label:'Good',        note:'Above OECD average — PISA 2022'},
  'Hungary':            {tier:3, score:476, label:'Good',        note:'OECD average — PISA 2022'},
  'Turkey':             {tier:3, score:453, label:'Good',        note:'PISA 2022'},
  'United Arab Emirates':{tier:3,score:429, label:'Good',       note:'International schools widely available — PISA 2022'},
  'Serbia':             {tier:2, score:440, label:'Developing',  note:'PISA 2022'},
  'Malaysia':           {tier:2, score:415, label:'Developing',  note:'PISA 2022'},
  'Thailand':           {tier:2, score:394, label:'Developing',  note:'PISA 2022 — intl schools available'},
  'Vietnam':            {tier:3, score:469, label:'Good',        note:'Strong public system — PISA 2022'},
  'Mexico':             {tier:2, score:395, label:'Developing',  note:'PISA 2022 — intl schools in major cities'},
  'Colombia':           {tier:2, score:391, label:'Developing',  note:'PISA 2022 — intl schools in Bogotá/Medellín'},
  'Argentina':          {tier:2, score:388, label:'Developing',  note:'PISA 2022'},
  'Uruguay':            {tier:2, score:411, label:'Developing',  note:'PISA 2022 — best in LatAm'},
  'Costa Rica':         {tier:2, score:397, label:'Developing',  note:'PISA 2022'},
  'Panama':             {tier:2, score:353, label:'Developing',  note:'PISA 2022 — intl schools in Panama City'},
  'Dominican Republic': {tier:1, score:0,   label:'Limited data',note:'Not in PISA 2022 — research locally'},
  'Cambodia':           {tier:1, score:0,   label:'Limited data',note:'Not in PISA 2022 — research locally'},
  'Indonesia':          {tier:2, score:366, label:'Developing',  note:'PISA 2022'},
  'Morocco':            {tier:1, score:0,   label:'Limited data',note:'Not in PISA 2022 — research locally'},
  'Mauritius':          {tier:2, score:0,   label:'Developing',  note:'Solid British-influenced system — not in PISA'},
  'Georgia':            {tier:2, score:400, label:'Developing',  note:'PISA 2022'},
  'Puerto Rico':        {tier:2, score:0,   label:'Developing',  note:'US curriculum — research locally'},
};

const EDU_EMOJI = {5:'🏆', 4:'🎓', 3:'📚', 2:'🏫', 1:'🔍'};
const EDU_COLOR = {5:'#14532d', 4:'#166534', 3:'#1e40af', 2:'#92400e', 1:'#6b7280'};
const EDU_BG    = {5:'#dcfce7', 4:'#d1fae5', 3:'#dbeafe', 2:'#fef3c7', 1:'#f3f4f6'};

// ── QUESTIONS ──────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id:'party', emoji:'👥',
    text:"How many people are making this move?",
    sub:"Your budget will be scaled accordingly in our matching.",
    options:[
      {icon:'🧍',label:'Just me',sub:'Solo — single person budget',value:'1'},
      {icon:'👫',label:'Two of us',sub:'Couple — budget covers two people',value:'2'},
      {icon:'👨‍👩‍👦',label:'Family with kids',sub:'Family — budget covers adults and children',value:'family'},
      {icon:'🤔',label:'Not sure yet',sub:"Treat as solo for now — I can retake later",value:'1_unsure'},
    ]
  },
  {
    id:'bedrooms', emoji:'🛏',
    text:"How many bedrooms do you need?",
    sub:"This affects rent estimates in your results. Home offices and guest rooms count.",
    options:[
      {icon:'🏠',label:'1 bedroom',sub:'Just the essentials — compact living',value:'1'},
      {icon:'🏡',label:'2 bedrooms',sub:'Guest room, home office, or growing family',value:'2'},
      {icon:'🏘',label:'3 bedrooms',sub:'Comfortable space for family or multiple offices',value:'3'},
      {icon:'🏰',label:'4 bedrooms',sub:'Spacious — room for everyone and everything',value:'4'},
      {icon:'🏯',label:'5+ bedrooms',sub:'Large household or premium lifestyle',value:'5'},
    ]
  },
  {
    id:'family_composition', emoji:'👨‍👩‍👧‍👦',
    text:"Tell us about your family",
    sub:"This helps us calculate accurate food and living costs for your household.",
    _showIf: (answers) => answers.party === 'family',
    options:[
      {icon:'👫👦',label:'2 adults, 1 child',sub:'Three people total',value:'2a_1k'},
      {icon:'👫👧👦',label:'2 adults, 2 children',sub:'Four people total',value:'2a_2k'},
      {icon:'👫👨‍👧‍👦',label:'2 adults, 3+ children',sub:'Five or more people',value:'2a_3k'},
      {icon:'🧑👦',label:'1 adult, 1–2 children',sub:'Single parent household',value:'1a_2k'},
    ]
  },
  {
    id:'education', emoji:'🎓',
    text:"How important is access to quality education?",
    sub:"This affects how we rank destinations for your family — from local public schools to international programmes.",
    _showIf: (answers) => answers.party === 'family',
    options:[
      {icon:'🏆',label:'Critical — top priority',sub:'Strong schools are non-negotiable for us',value:'critical'},
      {icon:'📚',label:'Very important',sub:'Good schools matter but we have flexibility',value:'high'},
      {icon:'🌍',label:'Somewhat important',sub:'We are open to homeschool or international options',value:'medium'},
      {icon:'✈️',label:'Not a factor right now',sub:'Kids are grown or education is handled',value:'low'},
    ]
  },
  {
    id:'budget', emoji:'💰',
    text:"What's your all-in monthly budget?",
    sub:"Include rent, food, transport, utilities, and fun. Think total lifestyle cost.",
    options:[
      {icon:'🪙',label:'Under $1,500/mo',sub:'Tight but very doable in the right places',value:'1'},
      {icon:'💳',label:'$1,500 – $2,500/mo',sub:'Comfortable in most destinations',value:'2'},
      {icon:'💎',label:'$2,500 – $4,000/mo',sub:'Generous — live well almost anywhere',value:'3'},
      {icon:'🏆',label:'$4,000+/mo',sub:'Premium — anywhere in the world',value:'4'},
      {icon:'✏️',label:'Enter my own budget',sub:'Type your monthly number',value:'custom'},
    ]
  },
  {
    id:'climate', emoji:'🌤',
    text:"What weather makes you feel most alive?",
    sub:"Be honest — this matters more than people think.",
    options:[
      {icon:'☀️',label:'Warm & sunny year-round',sub:'Tropical or dry warm climate',value:'warm'},
      {icon:'🌊',label:'Mediterranean',sub:'Hot summers, mild winters, lots of sun',value:'mediterranean'},
      {icon:'🍂',label:'Four real seasons',sub:"I actually like a proper winter sometimes",value:'seasons'},
      {icon:'🌿',label:'Mild & green',sub:'Never too hot, never too cold — temperate',value:'mild'},
    ]
  },
  {
    id:'setting', emoji:'🏙',
    text:"Where do you picture your daily life?",
    sub:"Not just what looks good on Instagram — where would you actually be happiest?",
    options:[
      {icon:'🌆',label:'Major city',sub:'World-class restaurants, nightlife, events, millions of people',value:'city'},
      {icon:'🏘',label:'Mid-size city',sub:'Urban energy, walkable, manageable — 200k–1m people',value:'midcity'},
      {icon:'🏖',label:'Coastal town or beach',sub:'Sea views, seafood, slower pace',value:'coastal'},
      {icon:'🏡',label:'Small town or village',sub:'Local, quiet, community feel',value:'town'},
    ]
  },
  {
    id:'safety', emoji:'🛡',
    text:"How important is safety and political stability?",
    sub:"Be honest — this directly affects which cities we show you.",
    options:[
      {icon:'🔒',label:'Critical — top priority',sub:"I'm not willing to compromise on this",value:'critical'},
      {icon:'✅',label:'Very important',sub:'Major safety issues would be a dealbreaker',value:'high'},
      {icon:'⚖️',label:'Somewhat important',sub:"I'll research specific areas — some risk is acceptable",value:'medium'},
      {icon:'🌍',label:'I make my own assessment',sub:"Safety data is one input — I decide for myself",value:'own'},
    ]
  },
  {
    id:'region', emoji:'🗺',
    text:"How far are you willing to go?",
    sub:"Distance from North America — both for travel home and time zone.",
    options:[
      {icon:'🌎',label:'Americas only',sub:'Latin America, Caribbean — same or similar time zones',value:'americas'},
      {icon:'🌍',label:'Europe',sub:'3–10 hour time difference — familiar culture',value:'europe'},
      {icon:'🌏',label:'Asia or Southeast Asia',sub:'Big time difference, big adventure, very low costs',value:'asia'},
      {icon:'✈️',label:'Anywhere — open map',sub:"Wherever the best fit is, I'll go",value:'anywhere'},
    ]
  },
  {
    id:'language', emoji:'🗣',
    text:"How do you feel about the local language?",
    sub:"Be realistic about daily life — navigating bureaucracy, doctors, landlords.",
    options:[
      {icon:'🇺🇸',label:'English only, please',sub:"I need to get by primarily in English",value:'english_only'},
      {icon:'🇪🇸',label:'Spanish is fine',sub:"I know some or I'll learn — Spanish speaking countries",value:'spanish'},
      {icon:'🌐',label:'Open to anything',sub:"I'll pick up whatever language is needed",value:'open'},
      {icon:'📚',label:'Language learning is part of the plan',sub:"Immersion is actually the goal",value:'learner'},
    ]
  },
  {
    id:'healthcare', emoji:'🏥',
    text:"How important is quality healthcare access?",
    sub:"Honest answer helps — especially if you have ongoing health needs.",
    options:[
      {icon:'❤️',label:'Critical — I have ongoing needs',sub:'Access to good hospitals and specialists is non-negotiable',value:'critical'},
      {icon:'✅',label:'Very important',sub:'I want good options available, even if I rarely use them',value:'high'},
      {icon:'⚖️',label:'Standard is fine',sub:"Basic access is enough — I'm generally healthy",value:'medium'},
      {icon:'🧘',label:'Less of a concern',sub:"I'll sort this separately — not a primary factor",value:'low'},
    ]
  },
  {
    id:'visa', emoji:'📋',
    text:"What best describes your situation?",
    sub:"This affects which visa paths are realistic for you.",
    options:[
      {icon:'🏖',label:'Retiring or semi-retired',sub:'Living on savings, pension, or passive income',value:'retire'},
      {icon:'💻',label:'Remote worker or freelancer',sub:'I work online for clients or employer outside the country',value:'nomad'},
      {icon:'💼',label:'Relocating with employer',sub:'My company is sending me or I have a local job offer',value:'employed'},
      {icon:'🔍',label:'Still exploring',sub:"No firm plans yet — just researching what's possible",value:'exploring'},
    ]
  },
  {
    id:'expat', emoji:'🤝',
    text:"How important is an established expat community?",
    sub:"Other Americans and Canadians nearby — for social connection and practical help.",
    options:[
      {icon:'🏘',label:'Essential',sub:"I want to meet other North Americans easily from day one",value:'essential'},
      {icon:'✅',label:'Nice to have',sub:'Helpful but not a dealbreaker if the city is great',value:'nice'},
      {icon:'🌍',label:'I prefer local immersion',sub:"I want to live like a local — not in an expat bubble",value:'local'},
      {icon:'🤷',label:"Doesn't matter",sub:'Not a factor in my decision at all',value:'neutral'},
    ]
  },
  {
    id:'population', emoji:'🏙',
    text:"What population size feels right?",
    sub:"This is about energy level and what's available day-to-day.",
    options:[
      {icon:'🌿',label:'Small — under 100,000',sub:'Quiet, local, everyone knows everyone',value:'1'},
      {icon:'🏘',label:'Mid-size — 100k to 500k',sub:'Urban but manageable, strong community feel',value:'2'},
      {icon:'🌆',label:'Large — 500k to 2 million',sub:'Proper city energy with everything you need',value:'3'},
      {icon:'🌃',label:'World city — 2 million+',sub:'Maximum options, maximum energy, maximum everything',value:'4'},
    ]
  },
  {
    id:'lifestyle', emoji:'✨',
    text:"What's your ideal daily life abroad?",
    sub:"Think about your average Tuesday, not just the fantasy weekend.",
    options:[
      {icon:'🧘',label:'Slow & peaceful',sub:'Coffee, sunsets, no rushing — decompression is the point',value:'slow'},
      {icon:'🏄',label:'Active & outdoors',sub:'Surf, hike, cycle, explore — physical lifestyle is central',value:'active'},
      {icon:'🎨',label:'Creative & social',sub:'Art, cafes, interesting people, culture — stimulation matters',value:'creative'},
      {icon:'💻',label:'Productive nomad',sub:'Great coworking, fast WiFi, routine — I still work hard',value:'nomad'},
    ]
  },
  {
    id:'timeline', emoji:'🗓',
    text:"When are you thinking of making the move?",
    sub:"Honest answer helps us calibrate how practical vs aspirational to be.",
    options:[
      {icon:'💭',label:'Just dreaming for now',sub:"Exploring the idea — no timeline or firm plans",value:'dreaming'},
      {icon:'📅',label:'Within 1–2 years',sub:'Getting serious — doing real research',value:'planning'},
      {icon:'⚡',label:'Within the next 12 months',sub:'Actively planning — this is happening',value:'soon'},
      {icon:'🧳',label:'Ready to go now',sub:"I just need to pick the right place",value:'now'},
    ]
  },
];

// ── CITY COST DETAILS ──────────────────────────────────────────────
// meal_cheap = cheap restaurant meal per person (USD)
// transit_mo = monthly transit pass (USD)
// Source: Numbeo March 2026 (verified) or training estimate (est)
const CITY_COSTS = {
  // Portugal
  "Portugal|Lisbon":     {meal:12, transit:40, population:"550k", dataNote:"Numbeo verified Mar 2026"},
  "Portugal|Porto":      {meal:11, transit:40, population:"240k", dataNote:"Numbeo verified Mar 2026"},
  "Portugal|Faro":       {meal:10, transit:35, population:"65k",  dataNote:"est"},
  "Portugal|Lagos":      {meal:12, transit:null,population:"35k",  dataNote:"est"},
  "Portugal|Cascais":    {meal:14, transit:40, population:"210k", dataNote:"est"},
  "Portugal|Braga":      {meal:9,  transit:35, population:"195k", dataNote:"est"},
  // Spain
  "Spain|Valencia":      {meal:12, transit:44, population:"800k", dataNote:"est"},
  "Spain|Barcelona":     {meal:15, transit:52, population:"1.6M", dataNote:"est"},
  "Spain|Madrid":        {meal:14, transit:55, population:"3.3M", dataNote:"est"},
  "Spain|Seville":       {meal:11, transit:49, population:"690k", dataNote:"est"},
  "Spain|Malaga":        {meal:12, transit:47, population:"580k", dataNote:"est"},
  "Spain|Alicante":      {meal:10, transit:38, population:"335k", dataNote:"est"},
  // France
  "France|Paris":        {meal:18, transit:90, population:"2.1M", dataNote:"est"},
  "France|Lyon":         {meal:15, transit:80, population:"520k", dataNote:"est"},
  "France|Bordeaux":     {meal:14, transit:72, population:"260k", dataNote:"est"},
  "France|Nice":         {meal:16, transit:60, population:"345k", dataNote:"est"},
  // Italy
  "Italy|Rome":          {meal:14, transit:35, population:"2.8M", dataNote:"est"},
  "Italy|Milan":         {meal:16, transit:40, population:"1.4M", dataNote:"est"},
  "Italy|Florence":      {meal:14, transit:35, population:"360k", dataNote:"est"},
  "Italy|Bologna":       {meal:13, transit:30, population:"415k", dataNote:"est"},
  // Germany
  "Germany|Berlin":      {meal:14, transit:90, population:"3.7M", dataNote:"est"},
  "Germany|Munich":      {meal:16, transit:96, population:"1.5M", dataNote:"est"},
  "Germany|Hamburg":     {meal:15, transit:110,population:"1.9M", dataNote:"est"},
  // Mexico
  "Mexico|Mexico City":  {meal:6,  transit:12, population:"9.2M", dataNote:"est"},
  "Mexico|Mérida":       {meal:5,  transit:10, population:"950k", dataNote:"est"},
  "Mexico|Oaxaca":       {meal:4,  transit:8,  population:"265k", dataNote:"est"},
  "Mexico|Puerto Vallarta":{meal:6,transit:null,population:"275k", dataNote:"est"},
  "Mexico|San Miguel de Allende":{meal:7,transit:null,population:"170k",dataNote:"est"},
  "Mexico|Playa del Carmen":{meal:7,transit:null,population:"300k",dataNote:"est"},
  // Colombia
  "Colombia|Medellín":   {meal:5,  transit:30, population:"2.5M", dataNote:"est"},
  "Colombia|Bogotá":     {meal:5,  transit:32, population:"7.4M", dataNote:"est"},
  "Colombia|Cartagena":  {meal:6,  transit:28, population:"1.0M", dataNote:"est"},
  // Costa Rica
  "Costa Rica|San José": {meal:8,  transit:30, population:"345k", dataNote:"est"},
  "Costa Rica|Tamarindo":{meal:10, transit:null,population:"20k",  dataNote:"est"},
  // Panama
  "Panama|Panama City":  {meal:8,  transit:30, population:"880k", dataNote:"est"},
  "Panama|Boquete":      {meal:7,  transit:null,population:"25k",  dataNote:"est"},
  // Thailand
  "Thailand|Chiang Mai": {meal:3,  transit:25, population:"130k", dataNote:"est"},
  "Thailand|Bangkok":    {meal:4,  transit:30, population:"10.5M",dataNote:"est"},
  "Thailand|Phuket":     {meal:5,  transit:null,population:"90k",  dataNote:"est"},
  // Malaysia
  "Malaysia|Kuala Lumpur":{meal:4, transit:50, population:"1.8M", dataNote:"est"},
  "Malaysia|Penang":     {meal:3,  transit:40, population:"720k", dataNote:"est"},
  // Indonesia
  "Indonesia|Bali (Canggu)":{meal:4,transit:null,population:"4.3M",dataNote:"est"},
  // Georgia
  "Georgia|Tbilisi":     {meal:5,  transit:20, population:"1.1M", dataNote:"est"},
  "Georgia|Batumi":      {meal:4,  transit:15, population:"170k", dataNote:"est"},
  // Vietnam
  "Vietnam|Ho Chi Minh City":{meal:3,transit:18,population:"9.0M",dataNote:"est"},
  "Vietnam|Da Nang":     {meal:3,  transit:15, population:"1.2M", dataNote:"est"},
  "Vietnam|Hoi An":      {meal:3,  transit:null,population:"120k", dataNote:"est"},
  // Australia
  "Australia|Melbourne": {meal:20, transit:135,population:"5.1M", dataNote:"est"},
  "Australia|Sydney":    {meal:22, transit:160,population:"5.3M", dataNote:"est"},
  "Australia|Brisbane":  {meal:18, transit:120,population:"2.6M", dataNote:"est"},
  // Canada
  "Canada|Vancouver":    {meal:18, transit:110,population:"675k", dataNote:"est"},
  "Canada|Toronto":      {meal:18, transit:156,population:"2.9M", dataNote:"est"},
  "Canada|Montreal":     {meal:16, transit:100,population:"1.8M", dataNote:"est"},
  // UAE
  "United Arab Emirates|Dubai":{meal:14,transit:55,population:"3.5M",dataNote:"est"},
  // Morocco
  "Morocco|Marrakech":   {meal:5,  transit:15, population:"1.0M", dataNote:"est"},
  "Morocco|Casablanca":  {meal:5,  transit:20, population:"3.7M", dataNote:"est"},
  // Turkey
  "Turkey|Istanbul":     {meal:6,  transit:25, population:"15.5M",dataNote:"est"},
  "Turkey|Antalya":      {meal:5,  transit:20, population:"1.3M", dataNote:"est"},
  // Japan
  "Japan|Tokyo":         {meal:12, transit:90, population:"13.9M",dataNote:"est"},
  "Japan|Osaka":         {meal:10, transit:80, population:"2.7M", dataNote:"est"},
  "Japan|Fukuoka":       {meal:9,  transit:65, population:"1.6M", dataNote:"est"},
  // New Zealand
  "New Zealand|Auckland":{meal:18, transit:120,population:"1.7M", dataNote:"est"},
  "New Zealand|Queenstown":{meal:20,transit:80,population:"15k",  dataNote:"est"},
  // Others
  "Serbia|Belgrade":     {meal:5,  transit:30, population:"1.7M", dataNote:"est"},
  "Croatia|Split":       {meal:10, transit:45, population:"180k", dataNote:"est"},
  "Uruguay|Montevideo":  {meal:8,  transit:35, population:"1.4M", dataNote:"est"},
  "Czech Republic|Prague":{meal:10,transit:35, population:"1.3M", dataNote:"est"},
  "Hungary|Budapest":    {meal:8,  transit:38, population:"1.8M", dataNote:"est"},
  "Philippines|Cebu City":{meal:3, transit:15, population:"950k", dataNote:"est"},
  "South Africa|Cape Town":{meal:8,transit:30, population:"4.6M", dataNote:"est"},
  "Mauritius|Port Louis":{meal:8,  transit:25, population:"150k", dataNote:"est"},
  "Ecuador|Cuenca":      {meal:4,  transit:20, population:"390k", dataNote:"est"},
  "Argentina|Buenos Aires":{meal:5,transit:20, population:"3.1M", dataNote:"est"},
  "Dominican Republic|Las Terrenas":{meal:8,transit:null,population:"30k",dataNote:"est"},
  "Cambodia|Phnom Penh": {meal:3,  transit:null,population:"2.3M", dataNote:"est"},
  "Puerto Rico|San Juan":{meal:12, transit:55, population:"320k", dataNote:"est"},
};

function getCityCosts(country, city) {
  return CITY_COSTS[`${country}|${city}`] || {meal: null, transit: null, dataNote:"est"};
}
// Total possible: 100 points
const WEIGHTS = {
  budget: 25,    // Most important — eliminates options
  safety: 20,    // Critical for some users
  climate: 15,   // Lifestyle driver
  setting: 10,   // City type
  region: 10,    // Distance/timezone
  language: 8,   // Practical daily factor
  healthcare: 5, // Important for older demographics
  expat: 4,      // Social factor
  population: 3, // Refinement
};

// ── QUIZ STATE ─────────────────────────────────────────────────────
let currentQ = 0;
let answers = {};
let historyStack = [];

// ── SCREEN MANAGEMENT ──────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHome() {
  showScreen('screen-home');
}

function scrollToCountries() {
  showScreen('screen-home');
  setTimeout(() => {
    document.getElementById('countries')?.scrollIntoView({behavior:'smooth'});
  }, 100);
}

// ── HOMEPAGE SETUP ─────────────────────────────────────────────────
function buildHomeBrowse() {
  const grid = document.getElementById('home-browse-grid');
  if (!grid) return;
  grid.innerHTML = COUNTRY_CARDS.map(c => `
    <div class="browse-card" onclick="startQuiz()">
      <span class="browse-flag">${c.flag}</span>
      <div class="browse-name">${c.country}</div>
      <div class="browse-cost">${c.cost}</div>
    </div>
  `).join('');
}

// ── QUIZ ───────────────────────────────────────────────────────────
function startQuiz() {
  currentQ = 0;
  answers = {};
  historyStack = [];
  showScreen('screen-quiz');
  renderQuestion();
  if (typeof gtag !== 'undefined') gtag('event', 'quiz_start');
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  // Calculate effective total — exclude questions that will be skipped
  const effectiveTotal = QUESTIONS.filter((q, i) => {
    if (i < currentQ) return false; // already passed
    const countrySkip = answers['_countryFilter'] && COUNTRY_SKIP_IDS.includes(q.id);
    const condSkip = q._showIf && !q._showIf(answers);
    return !countrySkip && !condSkip;
  }).length + currentQ;
  const pct = ((currentQ + 1) / effectiveTotal) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('quiz-step-label').textContent = `Question ${currentQ + 1} of ${effectiveTotal}`;
  document.getElementById('quiz-back-btn').style.display = currentQ > 0 ? 'block' : 'none';

  // Show country filter banner if active
  const stepsEl = document.getElementById('quiz-steps');
  if (stepsEl) {
    // Add country filter pill above steps if set
    const filterBanner = document.getElementById('quiz-filter-banner');
    if (answers['_countryFilter']) {
      const countryData = CITIES.find(c => c.country === answers['_countryFilter']);
      const flag = countryData?.flag || '';
      if (filterBanner) {
        filterBanner.style.display = 'block';
        filterBanner.innerHTML = `${flag} Showing cities in <strong>${answers['_countryFilter']}</strong> &nbsp;·&nbsp; <a href="#" onclick="clearCountryFilter(); return false;" style="color:var(--teal)">Show all countries</a>`;
      }
    } else {
      if (filterBanner) filterBanner.style.display = 'none';
    }

    let html = '';
    for (let i = 0; i < effectiveTotal; i++) {
      const isDone = i < currentQ;
      const isActive = i === currentQ;
      const cls = isDone ? 'done' : isActive ? 'active' : '';
      const onclick = isDone ? `onclick="jumpToQuestion(${i})"` : '';
      const title = isDone ? `title="Go back to Q${i+1}"` : '';
      html += `<div class="quiz-step-dot ${cls}" ${onclick} ${title}>${i + 1}</div>`;
      if (i < effectiveTotal - 1) {
        html += `<div class="quiz-step-connector ${isDone ? 'done' : ''}"></div>`;
      }
    }
    stepsEl.innerHTML = html;
  }

  document.getElementById('quiz-body').innerHTML = `
    <span class="q-pill fade-in">Step ${currentQ + 1} of ${effectiveTotal}</span>
    <span class="q-emoji fade-in">${q.emoji}</span>
    <p class="q-text fade-in">${q.text}</p>
    ${q.sub ? `<p class="q-subtext fade-in">${q.sub}</p>` : ''}
    <div class="options-grid fade-in">
      ${q.options.map(opt => `
        <button class="option-btn ${answers[q.id] === opt.value ? 'selected' : ''}"
          onclick="selectAnswer('${opt.value}', this)">
          <span class="opt-icon">${opt.icon}</span>
          <span class="opt-text">
            <span class="opt-label">${opt.label}</span>
            <span class="opt-sub">${opt.sub}</span>
          </span>
          <span class="opt-check">${answers[q.id] === opt.value ? '✓' : ''}</span>
        </button>
      `).join('')}
    </div>
    ${q.id === 'budget' ? `
      <div class="custom-wrap" id="custom-budget-wrap" ${answers['budget'] === 'custom' ? 'style="display:block"' : ''}>
        <div class="custom-label">Your all-in monthly budget (rent, food, everything):</div>
        <div class="custom-row">
          <span class="custom-prefix">$</span>
          <input type="number" class="custom-input" id="custom-budget-input"
            placeholder="e.g. 2200" min="300" max="50000" inputmode="numeric"
            value="${answers['_customBudget'] || ''}">
          <button class="custom-btn" onclick="submitCustomBudget()">Done →</button>
        </div>
      </div>
    ` : ''}
  `;
}

function selectAnswer(value, btn) {
  const q = QUESTIONS[currentQ];
  document.querySelectorAll('.option-btn').forEach(b => {
    b.classList.remove('selected');
    b.querySelector('.opt-check').textContent = '';
  });
  btn.classList.add('selected');
  btn.querySelector('.opt-check').textContent = '✓';

  if (q.id === 'budget' && value === 'custom') {
    const wrap = document.getElementById('custom-budget-wrap');
    if (wrap) { wrap.classList.add('visible'); wrap.style.display = 'block'; }
    setTimeout(() => document.getElementById('custom-budget-input')?.focus(), 100);
    return;
  }

  answers[q.id] = value;
  setTimeout(() => advance(), 220);
}

function submitCustomBudget() {
  const raw = parseInt(document.getElementById('custom-budget-input').value, 10);
  if (!raw || raw < 300) { document.getElementById('custom-budget-input').focus(); return; }
  answers['budget'] = raw < 1500 ? '1' : raw < 2500 ? '2' : raw < 4000 ? '3' : '4';
  answers['_customBudget'] = raw;
  advance();
}

// Questions auto-skipped when country is pre-selected
const COUNTRY_SKIP_IDS = ['region', 'language', 'safety'];

// Auto-set answers for skipped questions based on selected country
function autoSetCountryAnswers(countryName) {
  const city = CITIES.find(c => c.country === countryName);
  if (!city) return;
  // Region
  const regionMap = {europe:'europe',americas:'americas',caribbean:'americas',asia:'asia',pacific:'asia',middle_east:'anywhere',africa:'anywhere'};
  answers['region'] = regionMap[city.region] || 'anywhere';
  // Language
  const englishFirst = ['United Kingdom','Australia','New Zealand','Canada','Ireland','Singapore'];
  const spanishFirst = ['Spain','Mexico','Colombia','Costa Rica','Panama','Argentina','Dominican Republic','Uruguay','Puerto Rico'];
  answers['language'] = englishFirst.includes(countryName) ? 'english_only' : spanishFirst.includes(countryName) ? 'spanish_fine' : 'open';
  // Safety — from GPI score
  const gpi = city.gpi || 50;
  answers['safety'] = gpi >= 65 ? 'high' : gpi >= 45 ? 'medium' : 'own';
}

function advance() {
  historyStack.push(currentQ);
  currentQ++;
  // Skip questions that don't apply: country-redundant OR conditional _showIf not met
  while (currentQ < QUESTIONS.length) {
    const q = QUESTIONS[currentQ];
    const countrySkip = answers['_countryFilter'] && COUNTRY_SKIP_IDS.includes(q.id);
    const condSkip = q._showIf && !q._showIf(answers);
    if (countrySkip || condSkip) {
      currentQ++;
    } else {
      break;
    }
  }
  if (currentQ < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function quizBack() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

function clearCountryFilter() {
  delete answers['_countryFilter'];
  renderQuestion();
}

function jumpToQuestion(index) {
  if (index >= 0 && index < currentQ) {
    currentQ = index;
    renderQuestion();
  }
}

// ── SCORING ENGINE ─────────────────────────────────────────────────
function scoreCity(city) {
  let score = 0;
  const a = answers;

  // BUDGET (25pts) — scaled by party size, bedrooms, and family composition
  const budgetTier = parseInt(a.budget) || 2;
  const partyVal = a.party || '1';
  const compVal = a.family_composition || '';
  const bedroomsVal = a.bedrooms || '1';
  const bedroomMult = bedroomsVal === '1' ? 1 : bedroomsVal === '2' ? 1.5 : bedroomsVal === '3' ? 2.0 : bedroomsVal === '4' ? 2.5 : 3.1;

  // Headcount for food scaling
  let headcount = 1;
  if (partyVal === '2') headcount = 2;
  else if (partyVal === 'family') {
    if (compVal === '2a_1k') headcount = 3;
    else if (compVal === '2a_2k') headcount = 4;
    else if (compVal === '2a_3k') headcount = 5;
    else if (compVal === '1a_2k') headcount = 3;
    else headcount = 4;
  }
  const baseMult = partyVal === '1' || partyVal === '1_unsure' ? 1 : partyVal === '2' ? 1.7 : headcount * 0.65;
  const bedroomAdj = (bedroomMult - 1) * 0.3;
  const partyMultiplier = baseMult + bedroomAdj;

  const scaledCostTier = city.costTier * partyMultiplier;
  const effectiveCostTier = scaledCostTier <= 1.5 ? 1 : scaledCostTier <= 2.5 ? 2 : scaledCostTier <= 3.5 ? 3 : scaledCostTier <= 4.5 ? 4 : 5;
  if (effectiveCostTier <= budgetTier) score += 25;
  else if (effectiveCostTier === budgetTier + 1) score += 14;
  else if (effectiveCostTier === budgetTier + 2) score += 4;

  // SAFETY (20pts)
  const si = city.safetyIndex || 50;
  const safetyRating = si >= 60 ? 'high' : si >= 40 ? 'medium' : 'low';
  if (a.safety === 'critical') {
    if (safetyRating === 'high') score += 20;
    else if (safetyRating === 'medium') score += 6;
    else score += 0;
  } else if (a.safety === 'high') {
    if (safetyRating === 'high') score += 20;
    else if (safetyRating === 'medium') score += 13;
    else score += 4;
  } else if (a.safety === 'medium') {
    if (safetyRating === 'high') score += 20;
    else if (safetyRating === 'medium') score += 18;
    else score += 10;
  } else {
    score += 18; // 'own' — safety not penalised
  }

  // CLIMATE (15pts)
  if (a.climate === city.climate) score += 15;
  else {
    const compat = {
      warm: ['mediterranean'], mediterranean: ['warm','mild'],
      mild: ['mediterranean','seasons'], seasons: ['mild']
    };
    if ((compat[a.climate] || []).includes(city.climate)) score += 8;
  }

  // SETTING (10pts)
  if (a.setting === 'city') {
    if (city.setting === 'city') score += 10;
    else if (city.setting === 'midcity') score += 7;
  } else if (a.setting === 'midcity') {
    if (city.setting === 'midcity') score += 10;
    else if (['city','coastal','town'].includes(city.setting)) score += 6;
  } else if (a.setting === 'coastal') {
    if (city.coastal) score += 10;
    else score += 3;
  } else if (a.setting === 'town') {
    if (city.setting === 'town') score += 10;
    else if (city.setting === 'coastal') score += 7;
    else score += 4;
  }

  // REGION — hard exclusion if user specified a region
  const regionMap = {
    americas: ['americas','caribbean'],
    europe:   ['europe'],
    asia:     ['asia','pacific'],
    anywhere: ['europe','americas','asia','pacific','middle_east','africa','caribbean']
  };
  const validRegions = regionMap[a.region] || [];
  if (a.region === 'anywhere') {
    score += 10;
  } else if (validRegions.includes(city.region)) {
    score += 10;
  } else {
    // User was explicit — bury this city entirely
    score -= 80;
  }

  // LANGUAGE — hard exclusion for English only + low English city
  if (a.language === 'english_only') {
    if (city.english === 'very_high') score += 8;
    else if (city.english === 'high') score += 5;
    else if (city.english === 'moderate') score -= 20;
    else score -= 40; // low English + English only = hard bury
  } else if (a.language === 'spanish') {
    if (['americas','caribbean'].includes(city.region)) score += 8;
    else if (['high','very_high'].includes(city.english)) score += 6;
    else score += 4;
  } else {
    score += 6; // open/learner — no penalty
  }

  // HEALTHCARE (5pts)
  const hi = city.healthcareIndex || 55;
  if (a.healthcare === 'critical') {
    if (hi >= 70) score += 5;
    else if (hi >= 55) score += 3;
    else score += 0;
  } else if (a.healthcare === 'high') {
    if (hi >= 60) score += 5;
    else if (hi >= 45) score += 3;
    else score += 1;
  } else {
    score += 4; // medium/low — healthcare not penalised much
  }

  // EXPAT COMMUNITY (4pts)
  if (a.expat === 'essential') {
    const boost = {very_large:4,large:3,medium:1,small:0};
    score += (boost[city.expatCommunity] || 0);
  } else if (a.expat === 'local') {
    const boost = {very_large:1,large:2,medium:3,small:4};
    score += (boost[city.expatCommunity] || 2);
  } else {
    score += 3;
  }

  // POPULATION (3pts)
  const popAnswer = parseInt(a.population) || 3;
  const diff = Math.abs(city.popTier - popAnswer);
  score += diff === 0 ? 3 : diff === 1 ? 2 : diff === 2 ? 1 : 0;

  // EDUCATION (up to 12pts — only scored for families)
  if (a.party === 'family') {
    const edu = EDUCATION[city.country];
    const eduImportance = a.education || 'high';
    if (edu) {
      // Max points scale with how important education is to the family
      const maxPts = eduImportance === 'critical' ? 12 : eduImportance === 'high' ? 8 : eduImportance === 'medium' ? 4 : 0;
      if (maxPts > 0) {
        const eduScore = edu.tier === 5 ? maxPts :
                         edu.tier === 4 ? Math.round(maxPts * 0.85) :
                         edu.tier === 3 ? Math.round(maxPts * 0.60) :
                         edu.tier === 2 ? Math.round(maxPts * 0.25) : 0;
        score += eduScore;
      }
    }
  }

  return Math.round(score);
}

// ── RESULTS ────────────────────────────────────────────────────────
function showResults() {
  showScreen('screen-loading');

  setTimeout(() => {
    // Filter by country if user picked one from the modal
    const countryFilter = answers['_countryFilter'];
    const cityPool = countryFilter
      ? CITIES.filter(c => c.country === countryFilter)
      : CITIES;

    // Score all cities in the pool
    const scored = cityPool.map(c => ({...c, score: scoreCity(c)}))
      .sort((a, b) => b.score - a.score);

    // Deduplicate — max 2 cities per country in top 6 (only relevant when no country filter)
    const top5 = [];
    const countryCounts = {};
    for (const c of scored) {
      if (top5.length >= 6) break;
      const cc = countryCounts[c.country] || 0;
      const limit = countryFilter ? 10 : 2;
      if (cc < limit) {
        top5.push(c);
        countryCounts[c.country] = cc + 1;
      }
    }

    // Update headline
    const flag = top5[0]?.flag || '';
    document.getElementById('results-headline').textContent = countryFilter
      ? `Your top cities in ${countryFilter} ${flag}`
      : `Your top match: ${top5[0].city}, ${top5[0].country} ${top5[0].flag}`;
    document.getElementById('results-sub').textContent = countryFilter
      ? `Based on your answers, here are the best cities in ${countryFilter} for your lifestyle.`
      : `Based on your answers, here are the ${top5.length} cities that fit your life best.`;

    // Build cards
    const rankLabels = ['Best Match','2nd Pick','3rd Pick','4th Pick','5th Pick','6th Pick'];
    const rankClasses = ['rank-1','rank-2','rank-3','rank-other','rank-other','rank-other'];
    const maxScore = 100;

    // Build answers summary
    const summaryLabels = {
      party:              {label:'Party size',       map:{1:'Solo',2:'Couple',family:'Family with kids','1_unsure':'Not sure yet'}},
      bedrooms:           {label:'Bedrooms',         map:{1:'1 bedroom',2:'2 bedrooms',3:'3 bedrooms',4:'4 bedrooms',5:'5+ bedrooms'}},
      family_composition: {label:'Household',        map:{'2a_1k':'2 adults + 1 child','2a_2k':'2 adults + 2 children','2a_3k':'2 adults + 3+ children','1a_2k':'1 adult + 2 children'}},
      education:          {label:'Education',         map:{critical:'Critical priority',high:'Very important',medium:'Somewhat important',low:'Not a factor'}},
      budget:             {label:'Budget',           map:{1:'Under $1,500/mo',2:'$1,500–$2,500/mo',3:'$2,500–$4,000/mo',4:'$4,000+/mo'}},
      climate:            {label:'Climate',          map:{warm:'Warm & sunny',mediterranean:'Mediterranean',seasons:'Four seasons',mild:'Mild & green'}},
      setting:            {label:'Setting',          map:{city:'Major city',midcity:'Mid-size city',coastal:'Coastal town',town:'Small town'}},
      safety:             {label:'Safety',           map:{critical:'Critical priority',high:'Very important',medium:'Somewhat important',own:'Own assessment'}},
      region:             {label:'Region',           map:{americas:'Americas',europe:'Europe',asia:'Asia/SE Asia',anywhere:'Anywhere'}},
      language:           {label:'Language',         map:{english_only:'English only',spanish_fine:'Spanish fine',open:'Open to anything',learner:'Excited to learn'}},
      healthcare:         {label:'Healthcare',       map:{critical:'Critical',high:'Very important',medium:'Standard',low:'Less of a concern'}},
      visa:               {label:'Situation',        map:{retire:'Retiring/semi-retired',nomad:'Remote worker',employed:'Relocating with employer',exploring:'Still exploring'}},
      expat:              {label:'Expat community',  map:{essential:'Essential',nice:'Nice to have',local:'Prefer local',neutral:"Doesn't matter"}},
      lifestyle:          {label:'Lifestyle',        map:{slow:'Slow & peaceful',active:'Active outdoors',creative:'Creative & social',nomad:'Productive nomad'}},
    };

    const summaryItems = Object.entries(summaryLabels)
      .filter(([key]) => answers[key])
      .map(([key, {label, map}]) => {
        const val = map[answers[key]] || answers[key];
        return `<span style="display:inline-flex;align-items:center;gap:4px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:100px;padding:3px 10px;font-size:0.72rem;white-space:nowrap"><span style="font-weight:700;color:#334155">${label}:</span><span style="color:#475569">${val}</span></span>`;
      }).join('');

    const summaryHTML = `
      <div class="answers-summary" style="padding:10px 14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#64748b">📋 Your answers</span>
          <button onclick="retakeQuiz()" class="summary-retake" style="font-size:0.72rem">Retake →</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">${summaryItems}</div>
      </div>
    `;

    const cards = top5.map((c, i) => {
      const pct = Math.min(99, Math.round((c.score / maxScore) * 100));
      const si = c.safetyIndex || 50;
      const safetyClass = si >= 60 ? 'safety-high' : si >= 40 ? 'safety-medium' : 'safety-low';
      const safetyLabel = si >= 60 ? '🟢 High Safety' : si >= 40 ? '🟡 Medium Safety' : '🔴 Research Carefully';
      const costs = getCityCosts(c.country, c.city);
      const dataNote = costs.dataNote === 'Numbeo verified Mar 2026'
        ? '✓ Cost data: Numbeo, March 2026'
        : '* Cost estimates pending Numbeo verification April 2026';

      // ── BEDROOM CALCULATION ──────────────────────────────────────
      const bedroomsVal = answers.bedrooms || '1';
      const bedroomNum = bedroomsVal === '5' ? '5+' : bedroomsVal;
      const rentMultiplier = bedroomsVal === '1' ? 1 : bedroomsVal === '2' ? 1.5 : bedroomsVal === '3' ? 2.0 : bedroomsVal === '4' ? 2.5 : 3.1;
      const rentBase = c.rent_1br || null;
      const rentAdjusted = rentBase ? Math.round(rentBase * rentMultiplier) : null;
      const rentLabel = bedroomsVal === '1' ? '1BR city centre' : `${bedroomNum}BR city centre`;
      const rent = rentAdjusted ? `$${rentAdjusted.toLocaleString()}/mo` : '—';

      // ── HEADCOUNT FOR FOOD COSTS ────────────────────────────────
      const partyVal = answers.party || '1';
      const compVal = answers.family_composition || '';
      let headcount = 1;
      let partyLabel = '';
      if (partyVal === '2') { headcount = 2; partyLabel = ' (couple)'; }
      else if (partyVal === 'family') {
        if (compVal === '2a_1k') { headcount = 3; partyLabel = ' (2 adults + 1 child)'; }
        else if (compVal === '2a_2k') { headcount = 4; partyLabel = ' (2 adults + 2 children)'; }
        else if (compVal === '2a_3k') { headcount = 5; partyLabel = ' (2 adults + 3 children)'; }
        else if (compVal === '1a_2k') { headcount = 3; partyLabel = ' (1 adult + 2 children)'; }
        else { headcount = 4; partyLabel = ' (family)'; }
      }

      // ── BUDGET MULTIPLIER ────────────────────────────────────────
      // Base multiplier from headcount, adjusted for bedrooms
      const baseMult = partyVal === '1' || partyVal === '1_unsure' ? 1 : partyVal === '2' ? 1.7 : headcount * 0.65;
      const bedroomAdj = (rentMultiplier - 1) * 0.3; // bedroom premium adds ~30% weight to total
      const partyMult = baseMult + bedroomAdj;
      const displayBudget = c.budget_mo ? `~$${Math.round(c.budget_mo * partyMult).toLocaleString()}/mo${partyLabel}` : 'Cost varies';

      // ── MEAL COSTS ───────────────────────────────────────────────
      const mealPerPerson = costs.meal || null;
      const mealTotal = mealPerPerson ? Math.round(mealPerPerson * headcount) : null;
      const meal = mealPerPerson ? `$${mealPerPerson}/person` : '—';
      const mealKey = headcount > 1
        ? `Meal out per person · $${mealTotal} total for ${headcount}`
        : 'Cheap meal out (per person)';
      const transitPerPerson = costs.transit || null;
      const transit = transitPerPerson ? `$${transitPerPerson}/person` : '—';
      const transitKey = 'Monthly transit pass · per person';
      const popDisplay = costs.population ? costs.population : (
        c.popTier === 1 ? 'Under 100k' :
        c.popTier === 2 ? '100k – 500k' :
        c.popTier === 3 ? '500k – 2M' : '2M+');

      // ── EDUCATION (families only) ────────────────────────────────
      const edu = EDUCATION[c.country];
      const eduFlag = partyVal === 'family' ? (() => {
        if (!edu) return `<div class="edu-flag" style="background:#f3f4f6;border-top:1px solid #e5e7eb;padding:8px 20px;font-size:0.75rem;color:#6b7280">🔍 <strong>Education:</strong> No PISA data available for ${c.country} — research local and international schools directly.</div>`;
        return `<div class="edu-flag" style="background:${EDU_BG[edu.tier]};border-top:1px solid ${EDU_COLOR[edu.tier]}33;padding:8px 20px;font-size:0.75rem;color:${EDU_COLOR[edu.tier]}">
          ${EDU_EMOJI[edu.tier]} <strong>Education quality: ${edu.label}</strong>${edu.score ? ` — PISA score ${edu.score}` : ''} &nbsp;·&nbsp; <span style="opacity:0.8">${edu.note}</span>
          <div style="margin-top:3px;opacity:0.75;font-size:0.7rem">🏫 International school availability data coming Q3 2026</div>
        </div>`;
      })() : '';

      // ── GATE LOGIC ────────────────────────────────────────────────
      // Cities 1, 2, 3 (index 0,1,2): LOCKED — show flag, country, score only
      // Cities 4, 5 (index 3,4): FULLY VISIBLE — showroom for what unlock delivers
      const isLocked = i < 3;
      const isShowroom = i >= 3;

      // Locked card — teaser only
      if (isLocked) {
        return `
          <div class="result-card fade-in" style="position:relative;background:#fff;border:2px solid #e2e8f0;border-radius:14px;padding:16px 12px;text-align:center;box-sizing:border-box">
            <div class="rc-rank-row" style="justify-content:center;margin-bottom:8px;flex-wrap:wrap;gap:4px">
              <span class="rank-badge ${rankClasses[i]}">${rankLabels[i]}</span>
              <span class="match-pct">${pct}% match</span>
              <span class="safety-pill ${safetyClass}" style="font-size:0.62rem">${safetyLabel}</span>
            </div>
            <div style="font-size:1.8rem;margin-bottom:4px">${c.flag}</div>
            <div style="font-size:0.92rem;font-weight:700;color:#0f172a;margin-bottom:2px">${c.country}</div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:10px">🔒 City locked</div>
            <button onclick="document.getElementById('email-input').focus();document.getElementById('email-input').scrollIntoView({behavior:'smooth',block:'center'})" style="background:var(--teal);color:#fff;font-size:0.78rem;font-weight:700;padding:8px 12px;border-radius:8px;border:none;cursor:pointer;font-family:inherit;width:100%">Unlock this match →</button>
          </div>
        `;
      }

      // Showroom banner for city 4 (first unlocked)
      const showroomBanner = i === 3 ? `
        <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;padding:8px 12px;margin-bottom:12px;font-size:0.75rem;color:#92400e;text-align:center;font-weight:600">
          👆 Your top 3 city names are locked — enter your email below to unlock
        </div>` : '';

      // Compact preview tile for the 3-column unlocked row
      return `
        <div class="result-card fade-in" style="position:relative;background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;padding:16px;box-sizing:border-box">
          ${showroomBanner}
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <span class="rank-badge ${rankClasses[i]}" style="font-size:0.65rem">${rankLabels[i]}</span>
            <span class="match-pct" style="font-size:0.78rem">${pct}% match</span>
            <span class="safety-pill ${safetyClass}" style="font-size:0.65rem">${safetyLabel}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="font-size:1.6rem">${c.flag}</span>
            <div>
              <div style="font-size:0.92rem;font-weight:700;color:#0f172a;line-height:1.2">${c.city}</div>
              <div style="font-size:0.75rem;color:#64748b">${c.country}</div>
            </div>
          </div>
          <div style="font-size:0.85rem;font-weight:700;color:#0891b2;margin-bottom:8px">💰 ${displayBudget}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            ${c.tags.slice(0,2).map(t => `<span style="font-size:0.65rem;font-weight:600;background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;padding:2px 7px;border-radius:100px">${t}</span>`).join('')}
          </div>
          <div style="margin-top:10px;font-size:0.68rem;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:8px">🔓 Full costs, visa info &amp; healthcare unlocked with email</div>
        </div>
      `;
    });

    // Inject grid CSS once
    if (!document.getElementById('results-grid-style')) {
      const s = document.createElement('style');
      s.id = 'results-grid-style';
      s.textContent = `
        .results-row { display:grid; gap:14px; margin-bottom:14px; }
        .results-row-top { grid-template-columns: 1fr 1fr 1fr; }
        .results-row-bottom { grid-template-columns: 1fr 1fr 1fr; }
        @media(max-width:680px) {
          .results-row-top, .results-row-bottom { grid-template-columns: 1fr; }
        }
        @media(min-width:681px) and (max-width:900px) {
          .results-row-top { grid-template-columns: 1fr 1fr 1fr; }
          .results-row-bottom { grid-template-columns: 1fr 1fr 1fr; }
        }
      `;
      document.head.appendChild(s);
    }

    const lockedRow  = `<div class="results-row results-row-top">${cards.slice(0,3).join('')}</div>
    <div style="text-align:center;padding:6px 0;font-size:0.75rem;color:#94a3b8;font-weight:600">↓ Enter your email below to reveal these cities ↓</div>`;
    const unlockedRow = `<div class="results-row results-row-bottom">${cards.slice(3).join('')}</div>`;

    document.getElementById('results-cards').innerHTML = summaryHTML + lockedRow + unlockedRow;


    // Store top result + quiz context for personalised Beehiiv email
    const partyLabels   = {'1':'Solo','1_unsure':'Solo','2':'Couple','family':'Family with kids'};
    const bedroomLabels = {'1':'1 bedroom','2':'2 bedrooms','3':'3 bedrooms','4':'4 bedrooms','5':'5+ bedrooms'};
    const budgetLabels  = {'1':'Under $1,500/mo','2':'$1,500–$2,500/mo','3':'$2,500–$4,000/mo','4':'$4,000+/mo'};
    const climateLabels = {'warm':'Warm & sunny','mediterranean':'Mediterranean','seasons':'Four seasons','mild':'Mild & green'};
    const settingLabels = {'city':'Major city','midcity':'Mid-size city','coastal':'Coastal town','town':'Small town'};
    const safetyLabels  = {'critical':'Critical priority','high':'Very important','medium':'Somewhat important','own':'Own assessment'};
    const regionLabels  = {'americas':'Americas','europe':'Europe','asia':'Asia / SE Asia','anywhere':'Open to anywhere'};
    const langLabels    = {'english_only':'English only','spanish_fine':'Spanish fine','open':'Open to anything','learner':'Excited to learn'};
    const healthLabels  = {'critical':'Critical priority','high':'Very important','medium':'Standard','low':'Less of a concern'};
    const situLabels    = {'retire':'Retiring / semi-retired','nomad':'Remote worker','employed':'Relocating with employer','exploring':'Still exploring'};
    const expatLabels   = {'essential':'Essential','nice':'Nice to have','local':'Prefer local integration','neutral':"Doesn't matter"};
    const lifeLabels    = {'slow':'Slow & peaceful','active':'Active outdoors','creative':'Creative & social','nomad':'Productive nomad'};

    function buildCityScorecard(c, cost, answers) {
      const safetyLabel = c.safetyIndex >= 65 ? 'High' : c.safetyIndex >= 45 ? 'Medium' : 'Research carefully';
      const gpi = c.gpiRank ? `GPI rank #${c.gpiRank} globally` : '';
      const safetyNote = gpi ? `${safetyLabel} — ${gpi}` : safetyLabel;

      const climateMap = {mediterranean:'Mediterranean — year-round sun, mild winters', warm:'Warm & tropical — hot summers, warm winters', seasons:'Four seasons — distinct summer and winter', mild:'Mild & green — temperate climate year-round'};
      const climateNote = climateMap[c.climate] || c.climate || '—';

      const settingMap = {city:'Major city — full urban infrastructure', midcity:'Mid-size city — walkable, manageable scale', coastal:'Coastal town — beach access, relaxed pace', town:'Small town — quiet lifestyle, close community'};
      const settingNote = settingMap[c.setting] || c.setting || '—';

      const hlth = c.healthcareIndex;
      const healthNote = hlth >= 70 ? 'Excellent — international hospitals, affordable private insurance' : hlth >= 55 ? 'Good — solid private hospital network available' : 'Adequate — private hospitals available; research options';

      const engMap = {high:'English widely spoken — very accessible for English-only speakers', medium:'English in expat areas — some Spanish or local language helpful', low:'Limited English — language learning strongly recommended'};
      const langNote = engMap[c.english] || 'English availability varies';

      const expMap = {'very_large':'Very large — one of the world\'s top expat hubs', large:'Large — well-established North American community', medium:'Medium — growing expat presence', small:'Small — fewer expats, stronger local integration'};
      const expNote = expMap[c.expatCommunity] || 'Expat community present';

      const budgetNote = `${cost} for your profile — ${answers.budget === '1' ? 'well under budget' : answers.budget === '2' ? 'fits your range' : 'within your range'}`;

      return [
        `Budget: ${budgetNote}`,
        `Climate: ${climateNote}`,
        `Setting: ${settingNote}`,
        `Safety: ${safetyNote}`,
        `Healthcare: ${healthNote}`,
        `Language: ${langNote}`,
        `Expat community: ${expNote}`,
        `Overview: ${c.blurb || '—'}`
      ].join('\n');
    }

    function calcCost(c) {
      const pv = answers.party || '1';
      const cv = answers.family_composition || '';
      const bv = answers.bedrooms || '1';
      const bm = bv === '1' ? 1 : bv === '2' ? 1.5 : bv === '3' ? 2.0 : bv === '4' ? 2.5 : 3.1;
      let hc = 1;
      if (pv === '2') hc = 2;
      else if (pv === 'family') {
        if (cv === '2a_1k') hc = 3; else if (cv === '2a_2k') hc = 4;
        else if (cv === '2a_3k') hc = 5; else if (cv === '1a_2k') hc = 3; else hc = 4;
      }
      const base = pv === '1' || pv === '1_unsure' ? 1 : pv === '2' ? 1.7 : hc * 0.65;
      const pm = base + (bm - 1) * 0.3;
      return c.budget_mo ? `~$${Math.round(c.budget_mo * pm).toLocaleString()}/mo` : 'Cost varies';
    }

    window._quizResult = {
      city:         top5[0].city,
      country:      top5[0].country,
      budget:       top5[0].budget_mo,
      party_size:   partyLabels[answers.party]     || answers.party     || null,
      bedrooms:     bedroomLabels[answers.bedrooms] || answers.bedrooms  || null,
      budget_label: budgetLabels[answers.budget]   || null,
      climate:      climateLabels[answers.climate]  || answers.climate   || null,
      setting:      settingLabels[answers.setting]  || answers.setting   || null,
      safety:       safetyLabels[answers.safety]    || answers.safety    || null,
      preferred_region: regionLabels[answers.region]    || answers.region    || null,
      language:     langLabels[answers.language]    || answers.language  || null,
      healthcare:   healthLabels[answers.healthcare] || answers.healthcare || null,
      situation:    situLabels[answers.visa]        || answers.visa      || null,
      expat_community: expatLabels[answers.expat]  || answers.expat     || null,
      lifestyle:    lifeLabels[answers.lifestyle]   || answers.lifestyle || null,
      match_pct_1:  `${Math.min(99, Math.round((top5[0].score / 100) * 100))}/100`,
      cost_1:       calcCost(top5[0]),
      monthly_savings: (() => {
        const budgetMidpoints = {'1':1250,'2':2000,'3':3250,'4':4500};
        const mid = budgetMidpoints[answers.budget] || null;
        const cityRaw = top5[0].budget_mo;
        if (!mid || !cityRaw) return null;
        const partyVal = answers.party || '1';
        const bv = answers.bedrooms || '1';
        const bm = bv==='1'?1:bv==='2'?1.5:bv==='3'?2.0:bv==='4'?2.5:3.1;
        let hc=1; if(partyVal==='2')hc=2; else if(partyVal==='family')hc=4;
        const base = partyVal==='1'||partyVal==='1_unsure'?1:partyVal==='2'?1.7:hc*0.65;
        const pm = base+(bm-1)*0.3;
        const cityCost = Math.round(cityRaw*pm);
        const delta = mid - cityCost;
        return delta > 100 ? Math.round(delta/50)*50 : null;
      })(),
      savings_10yr: (() => {
        const budgetMidpoints = {'1':1250,'2':2000,'3':3250,'4':4500};
        const mid = budgetMidpoints[answers.budget] || null;
        const cityRaw = top5[0].budget_mo;
        if (!mid || !cityRaw) return null;
        const partyVal = answers.party || '1';
        const bv = answers.bedrooms || '1';
        const bm = bv==='1'?1:bv==='2'?1.5:bv==='3'?2.0:bv==='4'?2.5:3.1;
        let hc=1; if(partyVal==='2')hc=2; else if(partyVal==='family')hc=4;
        const base = partyVal==='1'||partyVal==='1_unsure'?1:partyVal==='2'?1.7:hc*0.65;
        const pm = base+(bm-1)*0.3;
        const cityCost = Math.round(cityRaw*pm);
        const delta = mid - cityCost;
        return delta > 100 ? Math.round((delta*120)/1000)*1000 : null;
      })(),
      city_2:       top5[1]?.city        || null,
      country_2:    top5[1]?.country     || null,
      match_pct_2:  top5[1] ? `${Math.min(99, Math.round((top5[1].score / 100) * 100))}/100` : null,
      cost_2:       top5[1] ? calcCost(top5[1]) : null,
      city_3:       top5[2]?.city        || null,
      country_3:    top5[2]?.country     || null,
      match_pct_3:  top5[2] ? `${Math.min(99, Math.round((top5[2].score / 100) * 100))}/100` : null,
      cost_3:       top5[2] ? calcCost(top5[2]) : null,
      city_4:       top5[3]?.city        || null,
      country_4:    top5[3]?.country     || null,
      match_pct_4:  top5[3] ? `${Math.min(99, Math.round((top5[3].score / 100) * 100))}/100` : null,
      cost_4:       top5[3] ? calcCost(top5[3]) : null,
      city_5:       top5[4]?.city        || null,
      country_5:    top5[4]?.country     || null,
      match_pct_5:  top5[4] ? `${Math.min(99, Math.round((top5[4].score / 100) * 100))}/100` : null,
      cost_5:       top5[4] ? calcCost(top5[4]) : null,
      city_6:       top5[5]?.city        || null,
      country_6:    top5[5]?.country     || null,
      match_pct_6:  top5[5] ? `${Math.min(99, Math.round((top5[5].score / 100) * 100))}/100` : null,
      cost_6:       top5[5] ? calcCost(top5[5]) : null,
      city_1_scorecard: buildCityScorecard(top5[0], calcCost(top5[0]), answers),
      city_2_scorecard: top5[1] ? buildCityScorecard(top5[1], calcCost(top5[1]), answers) : null,
      city_3_scorecard: top5[2] ? buildCityScorecard(top5[2], calcCost(top5[2]), answers) : null,
      city_4_scorecard: top5[3] ? buildCityScorecard(top5[3], calcCost(top5[3]), answers) : null,
      city_5_scorecard: top5[4] ? buildCityScorecard(top5[4], calcCost(top5[4]), answers) : null,
      city_6_scorecard: top5[5] ? buildCityScorecard(top5[5], calcCost(top5[5]), answers) : null
    };

    window._top5 = top5; // stored for unlockAllCities()
    showScreen('screen-results');
    if (typeof gtag !== 'undefined') {
      gtag('event', 'quiz_complete', {top_match: top5[0].city + ', ' + top5[0].country});
    }
  }, 900);
}

// ── SHARE RESULTS ──────────────────────────────────────────────────
function shareResults() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showShareToast('🔗 Link copied! Send it to your spouse or partner.');
    }).catch(() => {
      showShareFallback(url);
    });
  } else {
    showShareFallback(url);
  }
}

function showShareToast(msg) {
  let toast = document.getElementById('share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'share-toast';
    toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:12px 24px;border-radius:10px;font-size:0.9rem;font-weight:600;z-index:9999;font-family:inherit;box-shadow:0 4px 18px rgba(0,0,0,0.25);transition:opacity 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

function showShareFallback(url) {
  prompt('Copy this link and share it with your spouse or partner:', url);
}

// ── EMAIL CAPTURE ──────────────────────────────────────────────────

// ── UNLOCK ALL CITIES + PDF ─────────────────────────────────────────
function unlockAllCities() {
  const result = window._quizResult || {};
  const top5   = window._top5 || [];

  const rankLabels  = ['🥇 Best Match','🥈 2nd Pick','🥉 3rd Pick','4th','5th','6th'];
  const rankClasses = ['rank-1','rank-2','rank-3','rank-other','rank-other','rank-other'];

  const cities = [
    { name:result.city,    country:result.country,    pct:result.match_pct_1, cost:result.cost_1, sc:result.city_1_scorecard },
    { name:result.city_2,  country:result.country_2,  pct:result.match_pct_2, cost:result.cost_2, sc:result.city_2_scorecard },
    { name:result.city_3,  country:result.country_3,  pct:result.match_pct_3, cost:result.cost_3, sc:result.city_3_scorecard },
    { name:result.city_4,  country:result.country_4,  pct:result.match_pct_4, cost:result.cost_4, sc:result.city_4_scorecard },
    { name:result.city_5,  country:result.country_5,  pct:result.match_pct_5, cost:result.cost_5, sc:result.city_5_scorecard },
    { name:result.city_6,  country:result.country_6,  pct:result.match_pct_6, cost:result.cost_6, sc:result.city_6_scorecard },
  ].filter(c => c.name);

  const cards = cities.map((c, i) => {
    const flag = top5[i]?.flag || '🌍';
    const tags = (top5[i]?.tags || []).slice(0,3).map(t =>
      `<span style="font-size:0.65rem;font-weight:600;background:#f1f5f9;border:1px solid #e2e8f0;color:#475569;padding:2px 7px;border-radius:100px">${t}</span>`
    ).join('');
    const scLines = c.sc ? c.sc.split('\n').map(line => {
      const parts = line.split(': ');
      const label = parts[0] || '';
      const val   = parts.slice(1).join(': ');
      return `<div style="display:flex;gap:6px;font-size:0.78rem;padding:5px 0;border-bottom:1px solid #f1f5f9;line-height:1.5"><span style="font-weight:700;color:#334155;min-width:90px;flex-shrink:0">${label}</span><span style="color:#4a5568">${val}</span></div>`;
    }).join('') : '';
    const border = i === 0 ? '2px solid #0891b2' : '1.5px solid #e2e8f0';
    return `
      <div style="background:#fff;border:${border};border-radius:14px;padding:18px;box-sizing:border-box;break-inside:avoid;page-break-inside:avoid">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
          <span class="rank-badge ${rankClasses[i]}" style="font-size:0.7rem">${rankLabels[i]}</span>
          <span class="match-pct" style="font-size:0.82rem">${c.pct}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:2rem;line-height:1">${flag}</span>
          <div style="flex:1">
            <div style="font-size:1.05rem;font-weight:800;color:#0f1923">${c.name}</div>
            <div style="font-size:0.78rem;color:#64748b">${c.country}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.88rem;font-weight:700;color:#0891b2">${c.cost}</div>
            <div style="font-size:0.68rem;color:#94a3b8">est. monthly</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">${tags}</div>
        <div style="border-top:1px solid #e2e8f0;padding-top:8px">${scLines}</div>
      </div>`;
  }).join('');

  // Preserve answers summary, replace rest
  const container = document.getElementById('results-cards');
  const summaryEl = container.querySelector('.answers-summary');
  const summaryHTML = summaryEl ? summaryEl.outerHTML : '';

  container.innerHTML = summaryHTML +
    `<div id="unlocked-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">${cards}</div>`;

  // Show PDF button
  let pdfBtn = document.getElementById('pdf-download-btn');
  if (!pdfBtn) {
    pdfBtn = document.createElement('div');
    pdfBtn.id = 'pdf-download-btn';
    pdfBtn.style.cssText = 'text-align:center;margin:20px 0 8px';
    pdfBtn.innerHTML = `
      <button onclick="window.print()" style="background:#0891b2;color:#fff;font-size:0.95rem;font-weight:800;padding:14px 32px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;box-shadow:0 2px 8px rgba(8,145,178,0.25)">
        📄 Save Results as PDF
      </button>
      <div style="font-size:0.72rem;color:#94a3b8;margin-top:8px">Your browser will open a print dialog — choose "Save as PDF"</div>`;
    container.parentNode.insertBefore(pdfBtn, container.nextSibling);
  }

  // Inject print CSS once
  if (!document.getElementById('print-css')) {
    const s = document.createElement('style');
    s.id = 'print-css';
    s.textContent = `
      @media print {
        .nav, nav, header, .site-nav,
        #screen-quiz, #screen-welcome, #screen-loading,
        .email-gate, .email-form, #email-success,
        #feedback-card, .quiz-progress, .quiz-nav,
        .cta-section, .hero-section, footer, .site-footer,
        #pdf-download-btn button + div,
        .summary-retake { display:none !important; }
        body, html { background:#fff !important; }
        #screen-results { display:block !important; padding:0 !important; }
        #results-headline { font-size:1.4rem !important; margin-bottom:6px; }
        #unlocked-grid { grid-template-columns:1fr 1fr !important; gap:12px !important; }
        .answers-summary { border:1px solid #e2e8f0; border-radius:8px; margin-bottom:12px; }
        #pdf-download-btn { margin:8px 0 16px !important; }
        #pdf-download-btn button { background:#0891b2 !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        @page { margin:1.5cm; size:A4; }
      }
    `;
    document.head.appendChild(s);
  }
}

function handleEmail(e) {
  e.preventDefault();
  const email = document.getElementById('email-input').value;
  const result = window._quizResult || {};

  fetch('/.netlify/functions/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email:          email,
      top_city:       result.city         || null,
      top_country:    result.country      || null,
      monthly_budget: result.budget       ? Math.round(result.budget) : null,
      party_size:     result.party_size   || null,
      bedrooms:       result.bedrooms     || null,
      budget_label:   result.budget_label || null,
      climate:        result.climate          || null,
      setting:        result.setting          || null,
      safety:         result.safety           || null,
      preferred_region: result.preferred_region || null,
      language:       result.language         || null,
      healthcare:     result.healthcare       || null,
      situation:      result.situation        || null,
      expat_community: result.expat_community || null,
      lifestyle:      result.lifestyle        || null,
      match_pct_1:    result.match_pct_1  || null,
      cost_1:         result.cost_1       || null,
      monthly_savings: result.monthly_savings || null,
      savings_10yr:   result.savings_10yr   || null,
      city_2:         result.city_2       || null,
      country_2:      result.country_2    || null,
      match_pct_2:    result.match_pct_2  || null,
      cost_2:         result.cost_2       || null,
      city_3:         result.city_3       || null,
      country_3:      result.country_3    || null,
      match_pct_3:    result.match_pct_3  || null,
      cost_3:         result.cost_3       || null,
      city_4:         result.city_4       || null,
      country_4:      result.country_4    || null,
      match_pct_4:    result.match_pct_4  || null,
      cost_4:         result.cost_4       || null,
      city_5:         result.city_5       || null,
      country_5:      result.country_5    || null,
      match_pct_5:    result.match_pct_5  || null,
      cost_5:         result.cost_5       || null,
      city_6:         result.city_6       || null,
      country_6:      result.country_6    || null,
      match_pct_6:    result.match_pct_6  || null,
      cost_6:         result.cost_6       || null,
      city_1_scorecard: result.city_1_scorecard || null,
      city_2_scorecard: result.city_2_scorecard || null,
      city_3_scorecard: result.city_3_scorecard || null,
      city_4_scorecard: result.city_4_scorecard || null,
      city_5_scorecard: result.city_5_scorecard || null,
      city_6_scorecard: result.city_6_scorecard || null,
      utm_source: 'quiz',
      utm_medium:  'web'
    })
  }).catch(() => {});

  document.querySelector('.email-form').style.display = 'none';
  document.getElementById('email-success').style.display = 'block';
  unlockAllCities();
  if (typeof gtag !== 'undefined') gtag('event', 'email_capture', {source: 'quiz_results'});
}

function handleNewsletterSignup(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  // Route through Netlify function — direct Beehiiv POST blocked by PerimeterX
  fetch('/.netlify/functions/subscribe', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, utm_source: 'homepage', utm_medium: 'newsletter' })
  }).catch(() => {});
  const msg = document.getElementById('newsletter-msg');
  msg.textContent = "✅ You're in! Check your inbox shortly.";
  msg.style.color = '#22c55e';
  document.getElementById('newsletter-email').value = '';
  if (typeof gtag !== 'undefined') gtag('event', 'newsletter_signup', {source:'homepage'});
}

function retakeQuiz() {
  // Safely reset email capture UI
  const emailForm = document.querySelector('.email-form');
  const emailSuccess = document.getElementById('email-success');
  if (emailForm) emailForm.style.display = 'flex';
  if (emailSuccess) emailSuccess.style.display = 'none';
  // Full reset — clear everything before starting
  currentQ = 0;
  answers = {};
  historyStack = [];
  showScreen('screen-quiz');
  renderQuestion();
  if (typeof gtag !== 'undefined') gtag('event', 'quiz_retake');
}

// ── COUNTRY PICKER MODAL ───────────────────────────────────────────
function buildModalList(filter) {
  const list = document.getElementById('modal-list');
  if (!list) return;

  const countryMap = {};
  CITIES.forEach(c => {
    if (!countryMap[c.country]) {
      countryMap[c.country] = {flag: c.flag, minCost: c.budget_mo};
    } else {
      if (c.budget_mo < countryMap[c.country].minCost) countryMap[c.country].minCost = c.budget_mo;
    }
  });

  const sorted = Object.keys(countryMap).sort();
  const filtered = filter
    ? sorted.filter(c => c.toLowerCase().includes(filter.toLowerCase()))
    : sorted;

  list.innerHTML = filtered.map(country => {
    const {flag, minCost} = countryMap[country];
    const cost = minCost ? `From $${minCost.toLocaleString()}/mo` : '';
    return `
      <div class="modal-country-item" onclick="pickCountry('${country.replace(/'/g,"\\'")}')">
        <span class="modal-country-flag">${flag}</span>
        <span class="modal-country-name">${country}</span>
        <span class="modal-country-cost">${cost}</span>
      </div>
    `;
  }).join('');

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center;color:var(--ink4);padding:20px;font-size:0.85rem">No countries found</p>`;
  }
}

function openCountryModal() {
  const modal = document.getElementById('country-modal');
  if (!modal) return;
  modal.classList.add('open');
  buildModalList('');
  setTimeout(() => document.getElementById('modal-search')?.focus(), 100);
  if (typeof gtag !== 'undefined') gtag('event', 'country_modal_open');
}

function closeCountryModal(e) {
  if (e && e.target !== document.getElementById('country-modal')) return;
  document.getElementById('country-modal')?.classList.remove('open');
}

function filterModal(val) {
  buildModalList(val);
}

function pickCountry(country) {
  document.getElementById('country-modal')?.classList.remove('open');
  answers = {};
  answers['_countryFilter'] = country;
  autoSetCountryAnswers(country);
  currentQ = 0;
  historyStack = [];
  showScreen('screen-quiz');
  renderQuestion();
  if (typeof gtag !== 'undefined') gtag('event', 'country_selected', {country});
}
function buildCountryDropdown() {
  const menu = document.getElementById('country-dropdown-menu');
  if (!menu) return;

  // Get unique countries with flag and min cost, sorted alphabetically
  const countryMap = {};
  CITIES.forEach(c => {
    if (!countryMap[c.country]) {
      countryMap[c.country] = {flag: c.flag, minCost: c.budget_mo};
    } else {
      if (c.budget_mo < countryMap[c.country].minCost) countryMap[c.country].minCost = c.budget_mo;
    }
  });

  const sorted = Object.keys(countryMap).sort();
  menu.innerHTML = sorted.map(country => {
    const {flag, minCost} = countryMap[country];
    const cost = minCost ? `From $${minCost.toLocaleString()}/mo` : '';
    return `
      <div class="nav-dropdown-item" onclick="selectCountry('${country.replace(/'/g,"\\'")}')">
        <span class="nav-dropdown-flag">${flag}</span>
        <span class="nav-dropdown-name">${country}</span>
        <span class="nav-dropdown-cost">${cost}</span>
      </div>
    `;
  }).join('');
}

function toggleCountryDropdown() {
  const menu = document.getElementById('country-dropdown-menu');
  menu.classList.toggle('open');
}

function selectCountry(country) {
  document.getElementById('country-dropdown-menu').classList.remove('open');
  // Scroll to that country's card on homepage, or start quiz pre-filtered
  // For now: go home and scroll to the country cards section
  showScreen('screen-home');
  setTimeout(() => {
    const el = document.getElementById('countries');
    if (el) el.scrollIntoView({behavior:'smooth'});
  }, 100);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#country-dropdown')) {
    document.getElementById('country-dropdown-menu')?.classList.remove('open');
  }
});

// ── INIT ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildCountryDropdown();
  // Handle ?country= param from destinations page
  const urlCountry = new URLSearchParams(window.location.search).get('country');
  if (urlCountry) {
    // Check it's a valid country in our database
    const match = CITIES.find(c => c.country.toLowerCase() === urlCountry.toLowerCase());
    if (match) {
      // Small delay to let page render first
      setTimeout(() => pickCountry(match.country), 100);
    }
  }
});

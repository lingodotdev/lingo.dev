// Mock news data for demonstration
// In production, this would fetch from NewsAPI or similar service

const mockArticles = [
  {
    source: { id: "techcrunch", name: "TechCrunch" },
    author: "Sarah Chen",
    title: "AI-Powered Translation Tools Reshape Global Communication",
    description:
      "New developments in artificial intelligence are revolutionizing how businesses communicate across language barriers, with companies adopting advanced translation platforms.",
    url: "https://example.com/ai-translation",
    urlToImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    publishedAt: "2026-01-22T14:30:00Z",
    content:
      "The global translation market is experiencing unprecedented growth...",
  },
  {
    source: { id: "wired", name: "Wired" },
    author: "Marcus Thompson",
    title: "The Future of Web Development: Full-Stack JavaScript Frameworks",
    description:
      "Modern web frameworks are evolving rapidly, offering developers unprecedented power and flexibility in building scalable applications.",
    url: "https://example.com/web-dev-future",
    urlToImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    publishedAt: "2026-01-22T12:15:00Z",
    content: "Next.js, React, and other frameworks are leading the charge...",
  },
  {
    source: { id: "bbc-news", name: "BBC News" },
    author: "Emma Rodriguez",
    title: "Climate Summit Announces Breakthrough Carbon Capture Agreement",
    description:
      "World leaders have reached a historic agreement on carbon capture technology deployment, marking a significant step in climate change mitigation.",
    url: "https://example.com/climate-summit",
    urlToImage:
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b4?w=800&q=80",
    publishedAt: "2026-01-22T10:00:00Z",
    content:
      "The international climate summit concluded with unprecedented cooperation...",
  },
  {
    source: { id: "financial-times", name: "Financial Times" },
    author: "David Park",
    title: "Global Markets Rally on Positive Economic Indicators",
    description:
      "Stock markets worldwide surge as new economic data suggests stronger-than-expected growth across major economies.",
    url: "https://example.com/markets-rally",
    urlToImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    publishedAt: "2026-01-21T18:45:00Z",
    content: "Investors showed renewed confidence as economic indicators...",
  },
  {
    source: { id: "the-verge", name: "The Verge" },
    author: "Alex Kim",
    title: "Revolutionary Smartphone Features Redefine Mobile Photography",
    description:
      "The latest generation of smartphones introduces groundbreaking camera technology that rivals professional equipment.",
    url: "https://example.com/smartphone-cameras",
    urlToImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    publishedAt: "2026-01-21T16:20:00Z",
    content:
      "Mobile photography has reached a new milestone with computational imaging...",
  },
  {
    source: { id: "nature", name: "Nature" },
    author: "Dr. Lisa Anderson",
    title: "Breakthrough in Quantum Computing Promises Faster Drug Discovery",
    description:
      "Scientists achieve major milestone in quantum computing, potentially accelerating pharmaceutical research and development.",
    url: "https://example.com/quantum-drugs",
    urlToImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    publishedAt: "2026-01-21T14:00:00Z",
    content:
      "A team of researchers has demonstrated quantum advantage in molecular simulation...",
  },
  {
    source: { id: "reuters", name: "Reuters" },
    author: "James Wilson",
    title: "Renewable Energy Surpasses Fossil Fuels in Major Markets",
    description:
      "For the first time, renewable energy sources generate more electricity than fossil fuels in several developed nations.",
    url: "https://example.com/renewable-milestone",
    urlToImage:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    publishedAt: "2026-01-21T11:30:00Z",
    content: "The energy transition reached a symbolic turning point...",
  },
  {
    source: { id: "bloomberg", name: "Bloomberg" },
    author: "Rachel Martinez",
    title: "Tech Giants Invest Billions in AI Infrastructure",
    description:
      "Major technology companies announce massive investments in AI data centers and computing infrastructure.",
    url: "https://example.com/ai-investment",
    urlToImage:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    publishedAt: "2026-01-21T09:00:00Z",
    content:
      "The race for AI supremacy intensifies with unprecedented capital deployment...",
  },
  {
    source: { id: "national-geographic", name: "National Geographic" },
    author: "Dr. Michael Foster",
    title: "Ancient Civilization Discovered Using Advanced Satellite Imaging",
    description:
      "Archaeologists uncover evidence of previously unknown ancient civilization in remote rainforest region.",
    url: "https://example.com/ancient-discovery",
    urlToImage:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    publishedAt: "2026-01-20T17:15:00Z",
    content:
      "Using cutting-edge LiDAR technology, researchers have mapped extensive ruins...",
  },
  {
    source: { id: "espn", name: "ESPN" },
    author: "Chris Taylor",
    title: "Olympic Committee Announces New Events for 2028 Games",
    description:
      "Breaking news as Olympic organizers reveal addition of several new sports to the 2028 Summer Olympics program.",
    url: "https://example.com/olympic-events",
    urlToImage:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    publishedAt: "2026-01-20T15:00:00Z",
    content:
      "The International Olympic Committee voted to include emerging sports...",
  },
  {
    source: { id: "guardian", name: "The Guardian" },
    author: "Sophie Bennett",
    title: "Universal Basic Income Pilot Shows Promising Results",
    description:
      "Multi-year study on universal basic income reveals positive impacts on employment and well-being.",
    url: "https://example.com/ubi-results",
    urlToImage:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    publishedAt: "2026-01-20T13:30:00Z",
    content: "The largest UBI trial to date has produced comprehensive data...",
  },
  {
    source: { id: "time", name: "TIME" },
    author: "Jennifer Wu",
    title: "Space Tourism Industry Reaches New Milestone",
    description:
      "Commercial space travel becomes more accessible as prices drop and safety records improve.",
    url: "https://example.com/space-tourism",
    urlToImage:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80",
    publishedAt: "2026-01-20T11:00:00Z",
    content: "The space tourism sector celebrates its 1000th passenger...",
  },
  {
    source: { id: "npr", name: "NPR" },
    author: "Tom Harrison",
    title: "Education Revolution: AI Tutors Transform Learning",
    description:
      "Artificial intelligence-powered personalized tutoring systems show remarkable improvements in student outcomes.",
    url: "https://example.com/ai-education",
    urlToImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    publishedAt: "2026-01-19T16:45:00Z",
    content: "Schools worldwide are adopting AI-assisted learning platforms...",
  },
  {
    source: { id: "scientific-american", name: "Scientific American" },
    author: "Dr. Amanda Green",
    title: "Fusion Energy Achieves Net Positive Output Milestone",
    description:
      "Multiple fusion reactors demonstrate sustained net energy gain, bringing clean fusion power closer to reality.",
    url: "https://example.com/fusion-breakthrough",
    urlToImage:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    publishedAt: "2026-01-19T14:20:00Z",
    content: "The long-promised breakthrough in fusion energy has arrived...",
  },
  {
    source: { id: "cnn", name: "CNN" },
    author: "Robert Chen",
    title: "Urban Vertical Farms Feed Growing Populations",
    description:
      "High-tech vertical farming operations emerge as solution to food security challenges in megacities.",
    url: "https://example.com/vertical-farms",
    urlToImage:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    publishedAt: "2026-01-19T12:00:00Z",
    content: "Metropolitan areas are embracing agricultural innovation...",
  },
  {
    source: { id: "washington-post", name: "Washington Post" },
    author: "Katherine Moore",
    title: "Cybersecurity Advances Combat Rising Digital Threats",
    description:
      "New security technologies and international cooperation strengthen defenses against cyberattacks.",
    url: "https://example.com/cybersecurity",
    urlToImage:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    publishedAt: "2026-01-19T10:30:00Z",
    content:
      "Government and private sector collaboration yields stronger protections...",
  },
  {
    source: { id: "forbes", name: "Forbes" },
    author: "Daniel Thompson",
    title: "Sustainable Fashion Industry Reaches Tipping Point",
    description:
      "Major fashion brands commit to carbon-neutral production as consumer demand for sustainability grows.",
    url: "https://example.com/sustainable-fashion",
    urlToImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea663d6e?w=800&q=80",
    publishedAt: "2026-01-18T18:00:00Z",
    content:
      "The fashion industry's sustainability transformation accelerates...",
  },
  {
    source: { id: "politico", name: "Politico" },
    author: "Laura Stevens",
    title: "International Trade Agreements Foster Economic Cooperation",
    description:
      "New multilateral trade frameworks aim to boost economic growth while addressing environmental concerns.",
    url: "https://example.com/trade-agreements",
    urlToImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    publishedAt: "2026-01-18T15:45:00Z",
    content: "Diplomats celebrate breakthrough in long-stalled negotiations...",
  },
  {
    source: { id: "mit-tech-review", name: "MIT Technology Review" },
    author: "Dr. James Lee",
    title: "Brain-Computer Interfaces Enable Direct Neural Communication",
    description:
      "Advances in neurotechnology allow paralyzed patients to control devices with thought alone.",
    url: "https://example.com/brain-interfaces",
    urlToImage:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    publishedAt: "2026-01-18T13:15:00Z",
    content: "Medical breakthroughs in BCI technology restore independence...",
  },
  {
    source: { id: "harvard-business", name: "Harvard Business Review" },
    author: "Professor Sarah Johnson",
    title: "Remote Work Revolution Reshapes Corporate Real Estate",
    description:
      "Companies adapt to hybrid work models, transforming office spaces and urban development patterns.",
    url: "https://example.com/remote-work",
    urlToImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    publishedAt: "2026-01-18T11:00:00Z",
    content:
      "The pandemic's lasting impact on work culture continues to evolve...",
  },
  {
    source: { id: "atlantic", name: "The Atlantic" },
    author: "Michael Zhang",
    title: "Digital Privacy Laws Reshape Tech Industry Practices",
    description:
      "Comprehensive data protection regulations force major changes in how companies handle user information.",
    url: "https://example.com/privacy-laws",
    urlToImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    publishedAt: "2026-01-17T16:30:00Z",
    content:
      "New legislative frameworks prioritize user consent and transparency...",
  },
  {
    source: { id: "economist", name: "The Economist" },
    author: "Victoria Walsh",
    title: "Automation Transforms Manufacturing, Creates New Jobs",
    description:
      "Industrial automation drives productivity while workforce retraining programs address skill gaps.",
    url: "https://example.com/automation-jobs",
    urlToImage:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    publishedAt: "2026-01-17T14:00:00Z",
    content: "The manufacturing sector undergoes digital transformation...",
  },
  {
    source: { id: "new-york-times", name: "The New York Times" },
    author: "Jessica Martinez",
    title: "Electric Aviation Takes Flight with Zero-Emission Aircraft",
    description:
      "Commercial airlines begin integrating electric planes for short-haul routes, reducing carbon footprint.",
    url: "https://example.com/electric-aviation",
    urlToImage:
      "https://images.unsplash.com/photo-1436491437985-f2a7c7c24bff?w=800&q=80",
    publishedAt: "2026-01-17T12:30:00Z",
    content:
      "The aviation industry embraces electrification amid climate pressures...",
  },
  {
    source: { id: "wall-street-journal", name: "Wall Street Journal" },
    author: "Andrew Collins",
    title: "Cryptocurrency Regulations Bring Stability to Digital Assets",
    description:
      "Clear regulatory frameworks boost institutional adoption of cryptocurrencies and blockchain technology.",
    url: "https://example.com/crypto-regulation",
    urlToImage:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    publishedAt: "2026-01-17T10:00:00Z",
    content:
      "Financial regulators worldwide coordinate on digital asset oversight...",
  },
  {
    source: { id: "vogue", name: "Vogue" },
    author: "Isabella Romano",
    title: "Virtual Fashion Shows Redefine Runway Experiences",
    description:
      "Digital fashion weeks combine AR and VR technologies to create immersive, accessible global events.",
    url: "https://example.com/virtual-fashion",
    urlToImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    publishedAt: "2026-01-16T17:00:00Z",
    content: "The fashion industry's digital evolution reaches new heights...",
  },
  {
    source: { id: "lancet", name: "The Lancet" },
    author: "Dr. Richard Adams",
    title: "mRNA Technology Revolutionizes Treatment of Rare Diseases",
    description:
      "Success of COVID-19 vaccines paves way for mRNA-based therapies targeting previously untreatable conditions.",
    url: "https://example.com/mrna-treatments",
    urlToImage:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    publishedAt: "2026-01-16T14:45:00Z",
    content:
      "Medical researchers leverage mRNA platform for diverse applications...",
  },
  {
    source: { id: "nature-climate", name: "Nature Climate Change" },
    author: "Dr. Elena Petrov",
    title: "Ocean Cleanup Technologies Remove Millions of Tons of Plastic",
    description:
      "Large-scale ocean cleanup operations achieve significant milestone in combating marine pollution.",
    url: "https://example.com/ocean-cleanup",
    urlToImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    publishedAt: "2026-01-16T12:15:00Z",
    content:
      "International efforts to restore ocean health show measurable progress...",
  },
  {
    source: { id: "fast-company", name: "Fast Company" },
    author: "Nathan Brooks",
    title: "Circular Economy Models Gain Corporate Momentum",
    description:
      "Major corporations adopt circular business models, dramatically reducing waste and resource consumption.",
    url: "https://example.com/circular-economy",
    urlToImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
    publishedAt: "2026-01-16T10:30:00Z",
    content:
      "Sustainability-focused business practices become industry standard...",
  },
  {
    source: { id: "smithsonian", name: "Smithsonian Magazine" },
    author: "Dr. Patricia Wong",
    title: "AI Helps Decode Ancient Languages and Lost Scripts",
    description:
      "Machine learning algorithms assist archaeologists in translating previously indecipherable ancient texts.",
    url: "https://example.com/ai-archaeology",
    urlToImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    publishedAt: "2026-01-15T16:00:00Z",
    content:
      "Artificial intelligence opens new windows into ancient civilizations...",
  },
  {
    source: { id: "architectural-digest", name: "Architectural Digest" },
    author: "Marcus Hamilton",
    title: "Smart Cities Integrate AI for Efficient Urban Management",
    description:
      "Advanced sensors and AI systems optimize traffic, energy use, and public services in metropolitan areas.",
    url: "https://example.com/smart-cities",
    urlToImage:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    publishedAt: "2026-01-15T14:20:00Z",
    content: "Urban planning enters new era with intelligent infrastructure...",
  },
  {
    source: { id: "rolling-stone", name: "Rolling Stone" },
    author: "Chris Anderson",
    title: "Streaming Platforms Transform Music Industry Economics",
    description:
      "New revenue models empower independent artists while major platforms invest in emerging talent.",
    url: "https://example.com/music-streaming",
    urlToImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    publishedAt: "2026-01-15T12:00:00Z",
    content: "The music industry's digital transformation benefits creators...",
  },
];

/**
 * Simulates fetching news articles
 * @param {number} page - Page number (0-indexed)
 * @param {number} pageSize - Number of articles per page
 * @returns {Promise<{articles: Array, total: number}>}
 */
export async function getNews(page = 0, pageSize = 10) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = page * pageSize;
  const end = start + pageSize;
  const articles = mockArticles.slice(start, end);

  return {
    articles,
    total: mockArticles.length,
    hasMore: end < mockArticles.length,
  };
}

/**
 * If you want to use real NewsAPI, uncomment this function
 * and set your API key in .env.local: NEXT_PUBLIC_NEWS_API_KEY=your_key
 */
/*
export async function getNewsFromAPI(page = 1, pageSize = 10) {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  
  if (!apiKey) {
    console.warn('NewsAPI key not found, using mock data');
    return getNews(page - 1, pageSize);
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    
    return {
      articles: data.articles,
      total: data.totalResults,
      hasMore: page * pageSize < data.totalResults,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return getNews(page - 1, pageSize);
  }
}
*/

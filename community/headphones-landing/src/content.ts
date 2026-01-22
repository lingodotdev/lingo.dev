export const defaultContent = {
  hero: {
    newArrival: "NEW ARRIVAL",
    title: "Wireless LingoBuds Pro",
    description: "Experience sound that speaks your language. Premium active noise cancellation meets instant translation technology.",
    cta: "Purchase Now - $249",
    watchVideo: "Watch Video",
    happyEars: "14k+ Happy Ears",
    rating: "4.9/5 Rating",
    voiceClarity: "VOICE CLARITY",
    hdStudio: "HD Studio"
  },
  features: {
    why: "Why LingoBuds?",
    title: "Core Features",
    subtitle: "It's a long established fact that a listening experience should be magical.",
    items: [
      {
        title: "Intelligent ANC",
        description: "Adaptive noise cancellation that filters out the world so you can focus on what matters."
      },
      {
        title: "Voice Assistant",
        description: "Seamlessly interact with your favorite voice assistants for hands-free control."
      },
      {
        title: "30h Battery Life",
        description: "All-day power with a wireless charging case that keeps you moving."
      }
    ]
  },
  reviews: {
    title: "What People Are Saying",
    subtitle: "Join thousands of audiophiles and travelers who have found their perfect companion.",
    items: [
      {
        text: "The sound quality is absolutely phentomenal. I've never heard my music with such clarity.",
        author: "Sarah J.",
        role: "Audio Engineer"
      },
      {
        text: "LingoBuds completely changed my commute. The noise cancellation is like magic.",
        author: "Michael T.",
        role: "Daily Commuter"
      },
      {
        text: "I love the design and how comfortable they are. I wear them all day without any fatigue.",
        author: "Emily R.",
        role: "Designer"
      }
    ]
  },
  specs: {
    title: "Technical Specifications",
    items: [
      { label: "Bluetooth", value: "5.3" },
      { label: "Battery", value: "30 Hours total" },
      { label: "Charging", value: "USB-C & Wireless" },
      { label: "Water Resistance", value: "IPX4" },
      { label: "Driver", value: "11mm Dynamic" },
      { label: "Chip", value: "Lingo H1 Headphone Chip" }
    ],
    disclaimer: "*Battery life varies by use and configuration. See support for more information.",
    viewDataSheet: "View Full Data Sheet"
  },
  navbar: {
    links: ["Overview", "Features", "Reviews", "Specs"],
    cta: "Buy Now"
  },
  lifestyle: {
    title: "Designed for Real Life",
    description: "Whether you are commuting, working out, or just relaxing, LingoBuds stay comfortably in your ears while delivering pristine audio quality anywhere.",
    items: [
      "Sweat & Water Resistant",
      "24h Comfort Fit",
      "Voice Assistant Ready"
    ]
  },
  detail: {
    title: "Power in Your Pocket",
    description: "The sleek charging case provides multiple additional charges for more than 24 hours of listening time."
  },
  footer: {
    rights: "© 2026 LingoBuds Inc. All rights reserved.",
    links: ["Privacy", "Terms", "Support"]
  }
};

export type Content = typeof defaultContent;

// Mock Data Implementation

export interface SchemeEligibility {
  occupation?: string[] | string;
  income_max?: number;
  age_min?: number;
  age_max?: number;
  gender?: string;
  category?: string[] | string;
}

export interface Scheme {
  id: string;
  scheme_id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility_criteria: SchemeEligibility;
  eligibility: SchemeEligibility;
  application_url?: string;
  department?: string;
  state?: string;
  category?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Hardcoded Mock Data
export const MOCK_SCHEMES: Scheme[] = [
  {
    id: "1",
    scheme_id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    description: "Financial support to farmer families across the country.",
    benefits: "₹6000 per year in three equal installments.",
    eligibility_criteria: { occupation: ["farmer"], income_max: 200000 },
    eligibility: { occupation: ["farmer"], income_max: 200000 },
    application_url: "https://pmkisan.gov.in",
    department: "Ministry of Agriculture",
    state: "Central",
    category: "farmer",
    status: "active",
  },
  {
    id: "2",
    scheme_id: "pm-awas-urban",
    name: "Pradhan Mantri Awas Yojana (Urban)",
    description: "Housing for all in urban areas by 2024.",
    benefits: "Subsidy on home loan interest rates.",
    eligibility_criteria: { income_max: 1800000, age_min: 18 }, // Fixed family_income_max -> income_max
    eligibility: { income_max: 1800000 },
    application_url: "https://pmaymis.gov.in",
    department: "Ministry of Housing",
    state: "Central",
    category: "housing",
    status: "active",
  },
  {
    id: "3",
    scheme_id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana",
    description: "Small deposit scheme for the girl child.",
    benefits: "High interest rate and tax benefits.",
    eligibility_criteria: { gender: "female", age_max: 10 },
    eligibility: { gender: "female", age_max: 10 },
    application_url: "https://www.india.gov.in",
    department: "Ministry of Women & Child Development",
    state: "Central",
    category: "women",
    status: "active",
  },
  {
    id: "4",
    scheme_id: "mudra-loan",
    name: "Pradhan Mantri Mudra Yojana",
    description:
      "Loans up to 10 Lakhs for non-corporate, non-farm small/micro enterprises.",
    benefits: "Collateral-free loans for business expansion.",
    eligibility_criteria: { occupation: ["business", "entrepreneur"] },
    eligibility: { occupation: ["business", "entrepreneur"] },
    application_url: "https://www.mudra.org.in",
    department: "Ministry of Finance",
    state: "Central",
    category: "business",
    status: "active",
  },
  {
    id: "5",
    scheme_id: "ayushman-bharat",
    name: "Ayushman Bharat Yojana",
    description:
      "Health insurance coverage of up to ₹5 lakh per family per year.",
    benefits: "Free secondary and tertiary healthcare.",
    eligibility_criteria: { income_max: 500000 },
    eligibility: { income_max: 500000 },
    application_url: "https://pmjay.gov.in",
    department: "Ministry of Health",
    state: "Central",
    category: "health",
    status: "active",
  },
  {
    id: "6",
    scheme_id: "national-scholarship",
    name: "National Merit Scholarship Portal",
    description: "Scholarships for students from minority communities.",
    benefits: "Financial assistance for tuition fees.",
    eligibility_criteria: { occupation: ["student"], income_max: 250000 },
    eligibility: { occupation: ["student"], income_max: 250000 },
    application_url: "https://scholarships.gov.in",
    department: "Ministry of Education",
    state: "Central",
    category: "student",
    status: "active",
  },
];

export async function getAllSchemes(): Promise<ServiceResult<Scheme[]>> {
  return { data: MOCK_SCHEMES, error: null, success: true };
}

export async function getSchemesByCategory(category: string) {
  const schemes = MOCK_SCHEMES.filter((s) => s.category === category);
  return schemes.map((scheme) => ({
    id: scheme.scheme_id || scheme.id,
    name: scheme.name,
    description: scheme.description,
    benefits: scheme.benefits,
    eligibility: scheme.eligibility_criteria || {},
    url: scheme.application_url,
    department: scheme.department,
    category: scheme.category,
  }));
}

export async function filterSchemes(
  eligibility: any,
): Promise<ServiceResult<Scheme[]>> {
  return { data: MOCK_SCHEMES, error: null, success: true };
}

export async function logSchemeInteraction() {
  // No-op
}

export async function logConversation() {
  // No-op
}

// Global type definitions for SchemeSaathi

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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface Language {
  code: string;
  label: string;
  nativeName?: string;
}

export interface UserProfile {
  age?: number;
  occupation?: string;
  income?: number;
  gender?: string;
  category?: string;
  state?: string;
  district?: string;
}

export interface SchemeFilter {
  category?: string;
  department?: string;
  state?: string;
  eligibility?: Partial<UserProfile>;
}

// Environment variables type safety
export interface EnvironmentConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  PERPLEXITY_API_KEY: string;
  LINGODOTDEV_API_KEY: string;
  NODE_ENV: "development" | "production" | "test";
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LanguageSelectorProps extends ComponentProps {
  isScrolled?: boolean;
}

export interface ChatInterfaceProps extends ComponentProps {
  initialMessages?: ChatMessage[];
  onMessageSent?: (message: string) => void;
}

// Database table types (matching Supabase schema)
export interface DatabaseScheme {
  id: string;
  scheme_id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility_criteria: Record<string, any>;
  application_url?: string;
  department?: string;
  state?: string;
  category?: string;
  status: "active" | "inactive" | "draft";
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserScheme {
  id: string;
  user_id: string;
  scheme_uuid: string;
  scheme_id: string;
  interaction_type: string;
  status: string;
  created_at: string;
}

export interface DatabaseConversation {
  id: string;
  user_id: string;
  platform: string;
  message_type: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface DatabaseAnalytics {
  id: string;
  user_id?: string;
  platform: string;
  event_type: string;
  event_data: Record<string, any>;
  created_at: string;
}

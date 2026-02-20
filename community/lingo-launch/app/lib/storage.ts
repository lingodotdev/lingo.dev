export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type SectionType = 'hero' | 'features' | 'cta' | 'text' | 'testimonial';

export interface PageSection {
  id: string;
  type: SectionType;
  content: Record<string, string>;
}

export interface SitePage {
  id: string;
  userId: string;
  title: string;
  description: string;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ─── Auth ────────────────────────────────────────────────────────────────────

function getUsers(): User[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem('lingolaunch_users');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: User[]) {
  localStorage.setItem('lingolaunch_users', JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const userId = localStorage.getItem('lingolaunch_current_user');
  if (!userId) return null;
  return getUsers().find((u) => u.id === userId) || null;
}

export function login(email: string, password: string): User | null {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('lingolaunch_current_user', user.id);
  }
  return user || null;
}

export function register(name: string, email: string, password: string): User | null {
  const users = getUsers();
  if (users.some((u) => u.email === email)) return null;
  const user: User = { id: generateId(), name, email, password };
  saveUsers([...users, user]);
  localStorage.setItem('lingolaunch_current_user', user.id);
  return user;
}

export function logout() {
  if (isBrowser()) {
    localStorage.removeItem('lingolaunch_current_user');
  }
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export function getAllPages(): SitePage[] {
  if (!isBrowser()) return [];
  const data = localStorage.getItem('lingolaunch_pages');
  return data ? JSON.parse(data) : [];
}

export function getAllContentStrings(): string[] {
  const pages = getAllPages();
  const strings = new Set<string>();

  pages.forEach(page => {
    strings.add(page.title);
    strings.add(page.description);
    page.sections.forEach(section => {
      Object.values(section.content).forEach(value => {
        if (value) strings.add(value);
      });
    });
  });

  return Array.from(strings);
}

function savePages(pages: SitePage[]) {
  localStorage.setItem('lingolaunch_pages', JSON.stringify(pages));
}

export function getPages(userId: string): SitePage[] {
  return getAllPages().filter((p) => p.userId === userId);
}

export function getPage(pageId: string): SitePage | null {
  return getAllPages().find((p) => p.id === pageId) || null;
}

export function createPage(userId: string, title: string, description: string): SitePage {
  const page: SitePage = {
    id: generateId(),
    userId,
    title,
    description,
    sections: [
      {
        id: generateId(),
        type: 'hero',
        content: {
          heading: 'Welcome to Our Page',
          subheading: 'Discover what we have to offer',
          buttonText: 'Learn More',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const pages = getAllPages();
  savePages([...pages, page]);
  return page;
}

export function updatePage(pageId: string, updates: Partial<SitePage>): SitePage | null {
  const pages = getAllPages();
  const index = pages.findIndex((p) => p.id === pageId);
  if (index === -1) return null;
  pages[index] = { ...pages[index], ...updates, updatedAt: new Date().toISOString() };
  savePages(pages);
  return pages[index];
}

export function deletePage(pageId: string) {
  savePages(getAllPages().filter((p) => p.id !== pageId));
}

// ─── Sections ────────────────────────────────────────────────────────────────

export function getDefaultContent(type: SectionType): Record<string, string> {
  switch (type) {
    case 'hero':
      return {
        heading: 'Welcome',
        subheading: 'Your subtitle here',
        buttonText: 'Get Started',
      };
    case 'features':
      return {
        heading: 'Our Features',
        feature1Title: 'Fast Performance',
        feature1Desc: 'Lightning quick load times for every visitor.',
        feature2Title: 'Easy to Use',
        feature2Desc: 'Intuitive interface that anyone can master.',
        feature3Title: 'Reliable',
        feature3Desc: 'Built to scale with your growing business.',
      };
    case 'text':
      return {
        heading: 'About Us',
        body: 'Tell your story here. Share what makes your product or service unique and why customers should choose you.',
      };
    case 'cta':
      return {
        heading: 'Ready to Get Started?',
        description: 'Take the next step and join thousands of satisfied customers.',
        buttonText: 'Sign Up Now',
      };
    case 'testimonial':
      return {
        quote: 'This product completely transformed how we do business. Highly recommended!',
        author: 'Jane Doe',
        role: 'CEO at TechCorp',
      };
  }
}

export function addSection(pageId: string, type: SectionType): SitePage | null {
  const page = getPage(pageId);
  if (!page) return null;
  const section: PageSection = {
    id: generateId(),
    type,
    content: getDefaultContent(type),
  };
  return updatePage(pageId, { sections: [...page.sections, section] });
}

export function updateSection(
  pageId: string,
  sectionId: string,
  content: Record<string, string>,
): SitePage | null {
  const page = getPage(pageId);
  if (!page) return null;
  const sections = page.sections.map((s) =>
    s.id === sectionId ? { ...s, content } : s,
  );
  return updatePage(pageId, { sections });
}

export function removeSection(pageId: string, sectionId: string): SitePage | null {
  const page = getPage(pageId);
  if (!page) return null;
  return updatePage(pageId, { sections: page.sections.filter((s) => s.id !== sectionId) });
}

export function moveSectionUp(pageId: string, sectionId: string): SitePage | null {
  const page = getPage(pageId);
  if (!page) return null;
  const idx = page.sections.findIndex((s) => s.id === sectionId);
  if (idx <= 0) return page;
  const sections = [...page.sections];
  [sections[idx - 1], sections[idx]] = [sections[idx], sections[idx - 1]];
  return updatePage(pageId, { sections });
}

export function moveSectionDown(pageId: string, sectionId: string): SitePage | null {
  const page = getPage(pageId);
  if (!page) return null;
  const idx = page.sections.findIndex((s) => s.id === sectionId);
  if (idx === -1 || idx >= page.sections.length - 1) return page;
  const sections = [...page.sections];
  [sections[idx], sections[idx + 1]] = [sections[idx + 1], sections[idx]];
  return updatePage(pageId, { sections });
}

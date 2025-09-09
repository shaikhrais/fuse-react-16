/**
 * Data Provider Configuration
 * Switch between MockAPI (default) and LightAPI providers
 */

export type DataProviderType = 'mock' | 'light';

export interface DataProviderConfig {
  type: DataProviderType;
  baseUrl: string;
  mockApiTable: string;
  lightApiTable: string;
}

// Environment-based provider selection
export const getDataProviderType = (): DataProviderType => {
  if (typeof window !== 'undefined') {
    // Client-side: Check localStorage first, then environment
    const stored = localStorage.getItem('dataProvider') as DataProviderType;
    if (stored && ['mock', 'light'].includes(stored)) {
      return stored;
    }
  }
  
  // Server-side or fallback: Use environment variable
  return (process.env.NEXT_PUBLIC_DATA_PROVIDER as DataProviderType) || 'mock';
};

// Provider configurations
export const DATA_PROVIDERS: Record<DataProviderType, Omit<DataProviderConfig, 'mockApiTable' | 'lightApiTable'> & { type: DataProviderType }> = {
  mock: {
    type: 'mock',
    baseUrl: '/api/mock'
  },
  light: {
    type: 'light', 
    baseUrl: process.env.NEXT_PUBLIC_LIGHT_API_URL || 'http://localhost:3001'
  }
};

// Table name mapping (same for both providers)
export const TABLE_MAPPINGS = {
  users: 'users',
  contacts: 'contacts',
  tasks: 'tasks',
  notifications: 'notifications',
  // Calendar
  calendar_events: 'calendar_events',
  calendar_labels: 'calendar_labels',
  // Mailbox  
  mailbox_mails: 'mailbox_mails',
  mailbox_filters: 'mailbox_filters',
  mailbox_labels: 'mailbox_labels',
  mailbox_folders: 'mailbox_folders',
  // Scrumboard
  scrumboard_members: 'scrumboard_members',
  scrumboard_lists: 'scrumboard_lists', 
  scrumboard_cards: 'scrumboard_cards',
  scrumboard_boards: 'scrumboard_boards',
  scrumboard_labels: 'scrumboard_labels',
  // E-commerce
  ecommerce_products: 'ecommerce_products',
  ecommerce_orders: 'ecommerce_orders',
  // Academy
  academy_courses: 'academy_courses',
  academy_course_steps: 'academy_course_steps',
  academy_categories: 'academy_categories',
  // Profile
  profile_albums: 'profile_albums',
  profile_media_items: 'profile_media_items',
  profile_activities: 'profile_activities',
  profile_posts: 'profile_posts',
  // Help Center
  help_center_guides: 'help_center_guides',
  help_center_faqs: 'help_center_faqs',
  help_center_guide_categories: 'help_center_guide_categories',
  // Messenger
  messenger_contacts: 'messenger_contacts',
  messenger_messages: 'messenger_messages',
  messenger_chat_list: 'messenger_chat_list',
  // File Manager
  file_manager_items: 'file_manager_items',
  notes_notes: 'notes_notes',
  notes_labels: 'notes_labels',
  // Dashboard Widgets
  project_dashboard_widgets: 'project_dashboard_widgets',
  crypto_dashboard_widgets: 'crypto_dashboard_widgets',
  finance_dashboard_widgets: 'finance_dashboard_widgets',
  analytics_dashboard_widgets: 'analytics_dashboard_widgets',
  // Settings
  app_account_settings: 'app_account_settings',
  app_notification_settings: 'app_notification_settings',
  app_security_settings: 'app_security_settings',
  app_team_members: 'app_team_members',
  // Reference
  countries: 'countries',
  ai_image_gen_presets: 'ai_image_gen_presets',
  ai_image_gen_items: 'ai_image_gen_items'
} as const;

export type TableName = keyof typeof TABLE_MAPPINGS;

// Get provider configuration for a specific table
export const getProviderConfig = (tableName: TableName): DataProviderConfig => {
  const providerType = getDataProviderType();
  const provider = DATA_PROVIDERS[providerType];
  
  return {
    ...provider,
    mockApiTable: TABLE_MAPPINGS[tableName],
    lightApiTable: TABLE_MAPPINGS[tableName]
  };
};

// Switch data provider at runtime (client-side only)
export const switchDataProvider = (provider: DataProviderType) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dataProvider', provider);
    // Reload to apply changes
    window.location.reload();
  }
};

// Get current provider info
export const getCurrentProvider = () => {
  const type = getDataProviderType();
  return {
    type,
    config: DATA_PROVIDERS[type],
    isLight: type === 'light',
    isMock: type === 'mock'
  };
};
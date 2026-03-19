// tipos do projeto

export interface User {
  user_id: string;
  user_name: string;
  user_code: string;
  created_at: string;
  update_at: string;
}

export interface BrandParameters {
  id?: string;
  user_code: string;
  user_id: string;
  tone?: string;
  personality?: string;
  language_style?: string;
  archetype?: string;
  keywords?: string[];
  avoid_words?: string[];
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  typography?: string;
  image_style?: string;
}

export interface ICPArchetype {
  id?: string;
  user_code: string;
  user_id: string;
  name?: string;
  description?: string;
  pain_points?: string[];
  value_prop?: string[];
  status?: string;
}

export interface IAConfig {
  id?: string;
  user_code: string;
  user_id: string;
  system_prompt: string;
  user_template: string;
  model: string;
  temperature: number;
  max_tokens: number;
}

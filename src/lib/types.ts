// tipos do projeto

export interface User {
  user_id: string;
  user_name: string;
  user_code: string;
  created_at: string;
  update_at: string;
}

export interface BrandParameters {
  id: string;
  user_code: string;
  user_id: string;
  color_palette: string[] | null;   // jsonb → array de hex strings
  typography: string | null;
  image_style: string | null;
  sentence_length: string | null;
  formality_level: string | null;
  jargon_level: string | null;
  emotional_tone: string | null;
  cta_intensity: string | null;
  brand_keywords: string | null;
  created_at: string;
  update_at: string;
}

export interface ICPArchetype {
  id: string;
  user_code: string;
  user_id: string;
  icp_name: string | null;
  pain_points: string[] | null;   // jsonb → array de strings
  value_prop: string[] | null;    // jsonb → array de strings
  status: string | null;
  created_at: string;
  update_at: string;
  inactivated_at: string | null;
}

export interface IAConfig {
  id?: string;
  user_code: string;
  user_id: string;
  system_prompt_txt: string;
  user_template_txt: string;
  system_prompt_img: string;
  user_template_img: string;
  model: string;
  temperature: number;
  max_tokens: number;
  prompt_blocks_json?: unknown;
}

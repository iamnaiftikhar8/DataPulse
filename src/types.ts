// src/types.ts - COMPLETE UPDATED VERSION

// -----------------------------
// AI Analysis Types
// -----------------------------
export type DetailedSummary = {
  executive_overview: string;
  key_trends: string[];
  action_items_quick_wins: string[];
  data_quality_assessment?: string;
  business_implications?: string[];
  recommendations?: {
    short_term: string[];
    long_term: string[];
  };
  risk_alerts?: string[];
  predictive_insights?: string[];
  industry_comparison?: string;
  anomalies_detected?: string[];
  success_metrics?: string[];
  next_steps?: string[];
};

// -----------------------------
// AI Visualization Types
// -----------------------------
export interface AIChart {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'histogram';
  data: any[];
  config: {
    x_axis?: string;
    y_axis?: string;
    color_by?: string;
    category?: string;
    is_histogram?: boolean;
  };
  ai_metadata: {
    title: string;
    description: string;
    insights: string[];
    recommended_by: 'AI' | 'fallback';
  };
}

export interface VisualizationMetadata {
  primary_insights: string[];
  data_story: string;
  recommendations: any[];
}

export interface VisualizationRecommendation {
  chart_type: string;
  title: string;
  description: string;
  data_columns: string[];
  x_axis: string;
  y_axis: string;
  color_by?: string;
  filters?: {
    column: string;
    values: string[];
  };
  insights: string[];
}

// -----------------------------
// Main Analysis Result Type
// -----------------------------
export type AnalysisResult = {
  profiling: {
    rows: number;
    columns: number;
    missing_total: number;
    dtypes: Record<string, string>;
    numeric_columns: string[];
  };
  kpis: {
    total_rows: number;
    total_columns: number;
    missing_pct: number | null;
    duplicate_rows: number;
    outliers_total: number;
    rows_per_day: number | null;
    worst_outlier_column?: string | null;
    suspected_keys?: string[];
    cardinality_top3?: [string, number][];
    top_variance_numeric_cols?: string[];

    time?: {
      date_column?: string | null;
      min_date?: string | null;
      max_date?: string | null;
      days_covered?: number | null;
      latest_is_recent?: boolean | null;
    };
  };
  
  // Updated charts to use AI-powered charts
  charts: Record<string, AIChart>;
  
  // New visualization metadata
  visualizations_metadata?: VisualizationMetadata;
  
  insights?: {
    summary?: string;
    key_insights?: string[];
    recommendations?: string[];
  };
  
  detailed_summary?: DetailedSummary;
  
  // Session and file info
  session_id?: string;
  upload_id?: string;
  file?: {
    name: string;
    size_bytes: number;
  };
};

// -----------------------------
// Backend API Response Types
// -----------------------------
export interface AIAnalysisResponse {
  executive_overview: string;
  data_quality_assessment: string;
  key_trends: string[];
  business_implications: string[];
  recommendations: {
    short_term: string[];
    long_term: string[];
  };
  action_items_quick_wins: string[];
  risk_alerts: string[];
  predictive_insights: string[];
  industry_comparison: string;
}

export interface AIVisualizationResponse {
  charts: Record<string, AIChart>;
  primary_insights: string[];
  data_story: string;
  recommendations: VisualizationRecommendation[];
  session_id?: string;
  upload_id?: string;
}

// -----------------------------
// Frontend Component Props
// -----------------------------
export interface AnalysisResultModalProps {
  open: boolean;
  onClose: () => void;
  data: AnalysisResult;
  onExportPdf: () => void;
}

export interface AIChartsProps {
  charts: Record<string, AIChart>;
  metadata?: VisualizationMetadata;
}

// -----------------------------
// File Upload & Analysis Types
// -----------------------------
export interface FileUploadState {
  dragOver: boolean;
  file: File | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'done';
  progress: number;
  result: AnalysisResult | null;
  modalOpen: boolean;
}

export interface AnalysisRequest {
  file: File;
  business_goal?: string;
  audience?: 'executive' | 'analyst' | 'product' | 'sales';
}

// -----------------------------
// User & Auth Types
// -----------------------------
export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_login_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// -----------------------------
// Session Types
// -----------------------------
export interface Session {
  session_id: string;
  user_id: string;
  created_at: string;
  expires_at?: string;
  ip?: string;
  user_agent?: string;
}

// -----------------------------
// Error Types
// -----------------------------
export interface APIError {
  error: string;
  detail?: string;
  code?: string;
}

export interface AnalysisError {
  type: 'VALIDATION' | 'PROCESSING' | 'AUTH' | 'NETWORK';
  message: string;
  details?: any;
}

// -----------------------------
// Utility Types
// -----------------------------
export type Status = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

export interface ProgressState {
  percentage: number;
  message: string;
  step: 'upload' | 'process' | 'analyze' | 'visualize' | 'complete';
}
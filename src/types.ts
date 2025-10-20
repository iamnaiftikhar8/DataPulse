// src/types.ts
export type DetailedSummary = {
  executive_overview: string;
  key_trends: string[];
  action_items_quick_wins: string[];
  data_quality_assessment?: string;
  business_implications?: string[];
  recommendations?: {
  short_term: string[];
  long_term: string[];
};};
// src/types.ts
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
    top_variance_numeric_cols?: string[]; // <— add this

    time?: {
      date_column?: string | null;
      min_date?: string | null;
      max_date?: string | null;
      days_covered?: number | null;
      latest_is_recent?: boolean | null;
    };
  };
  charts: {
    line: { x: string | number; y: number }[];
    bar: { name: string; value: number }[];
    pie: { name: string; value: number }[];
  };
  insights?: {
    summary?: string;
  };
  detailed_summary?: {
    executive_overview?: string;
    key_trends?: string[];
    action_items_quick_wins?: string[];
  };
};

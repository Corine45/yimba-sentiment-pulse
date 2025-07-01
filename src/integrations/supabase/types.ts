export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_contexts: {
        Row: {
          confidence: number
          created_at: string
          generated_at: string
          id: string
          keywords: Json
          recommendations: Json
          sentiment: Json
          summary: string
          trends: Json
          triggers: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          generated_at?: string
          id?: string
          keywords?: Json
          recommendations?: Json
          sentiment?: Json
          summary: string
          trends?: Json
          triggers?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          generated_at?: string
          id?: string
          keywords?: Json
          recommendations?: Json
          sentiment?: Json
          summary?: string
          trends?: Json
          triggers?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      geographic_data: {
        Row: {
          coordinates: Json | null
          country: string
          created_at: string
          id: string
          mentions: number
          region: string
          sentiment_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          coordinates?: Json | null
          country: string
          created_at?: string
          id?: string
          mentions?: number
          region: string
          sentiment_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          coordinates?: Json | null
          country?: string
          created_at?: string
          id?: string
          mentions?: number
          region?: string
          sentiment_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      influencer_data: {
        Row: {
          created_at: string
          engagement_rate: number
          followers: number
          id: string
          influence_score: number
          name: string
          platform: string
          recent_posts: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          id?: string
          influence_score?: number
          name: string
          platform: string
          recent_posts?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_rate?: number
          followers?: number
          id?: string
          influence_score?: number
          name?: string
          platform?: string
          recent_posts?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_data: {
        Row: {
          content_url: string | null
          created_at: string
          engagement: Json
          id: string
          media_type: string
          mentions: number
          platform: string
          sentiment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string
          engagement?: Json
          id?: string
          media_type: string
          mentions?: number
          platform: string
          sentiment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_url?: string | null
          created_at?: string
          engagement?: Json
          id?: string
          media_type?: string
          mentions?: number
          platform?: string
          sentiment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      realtime_data: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: Json
          timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value: Json
          timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: Json
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          is_active: boolean | null
          keywords: string[]
          language: string | null
          last_executed_at: string | null
          name: string
          period: string | null
          platforms: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          keywords: string[]
          language?: string | null
          last_executed_at?: string | null
          name: string
          period?: string | null
          platforms: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: string[]
          language?: string | null
          last_executed_at?: string | null
          name?: string
          period?: string | null
          platforms?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          results_count: number | null
          search_term: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_term: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_term?: string
          user_id?: string
        }
        Relationships: []
      }
      search_results: {
        Row: {
          created_at: string | null
          executed_at: string | null
          id: string
          negative_sentiment: number | null
          neutral_sentiment: number | null
          platform: string
          positive_sentiment: number | null
          results_data: Json | null
          search_id: string | null
          search_term: string
          total_engagement: number | null
          total_mentions: number | null
          total_reach: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          executed_at?: string | null
          id?: string
          negative_sentiment?: number | null
          neutral_sentiment?: number | null
          platform: string
          positive_sentiment?: number | null
          results_data?: Json | null
          search_id?: string | null
          search_term: string
          total_engagement?: number | null
          total_mentions?: number | null
          total_reach?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          executed_at?: string | null
          id?: string
          negative_sentiment?: number | null
          neutral_sentiment?: number | null
          platform?: string
          positive_sentiment?: number | null
          results_data?: Json | null
          search_id?: string | null
          search_term?: string
          total_engagement?: number | null
          total_mentions?: number | null
          total_reach?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_results_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "saved_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_media_data: {
        Row: {
          author: string
          content: string
          created_at: string | null
          engagement: Json | null
          id: string
          platform: string
          reach: number | null
          search_term: string | null
          sentiment: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          engagement?: Json | null
          id?: string
          platform: string
          reach?: number | null
          search_term?: string | null
          sentiment?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          engagement?: Json | null
          id?: string
          platform?: string
          reach?: number | null
          search_term?: string | null
          sentiment?: string | null
        }
        Relationships: []
      }
      social_platforms: {
        Row: {
          api_key: string | null
          apify_actor_id: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          apify_actor_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          apify_actor_id?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_type: string
          recorded_at: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type: string
          recorded_at?: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          recorded_at?: string
          unit?: string
          value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          actions_performed: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          pages_visited: number | null
          session_end: string | null
          session_start: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          actions_performed?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          actions_performed?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          pages_visited?: number | null
          session_end?: string | null
          session_start?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_saved_search: {
        Args: { search_id: string }
        Returns: Json
      }
      generate_ai_context: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "analyste" | "observateur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "analyste", "observateur"],
    },
  },
} as const

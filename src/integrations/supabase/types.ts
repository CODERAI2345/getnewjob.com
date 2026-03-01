export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          about: string | null
          application_status: string | null
          applied_date: string | null
          brand_color: string | null
          brand_title_html: string | null
          button_gradient_angle: number | null
          button_gradient_color_1: string | null
          button_gradient_color_2: string | null
          career_benefits: string | null
          career_url: string
          collection_ids: string[] | null
          company_size: string | null
          core_strength: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          future_direction: string | null
          gradient_angle: number | null
          gradient_color_1: string | null
          gradient_color_2: string | null
          headcount: string | null
          hiring_technologies: string | null
          hq: string | null
          hq_city: string | null
          hq_country: string | null
          hr_contact: string | null
          id: string
          industry: string | null
          is_favorite: boolean
          is_pinned: boolean
          linkedin_url: string | null
          location: string | null
          logo_url: string | null
          name: string
          notable_products: string | null
          notes: string | null
          organization_strength: string | null
          stage: string | null
          technologies: string[] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          application_status?: string | null
          applied_date?: string | null
          brand_color?: string | null
          brand_title_html?: string | null
          button_gradient_angle?: number | null
          button_gradient_color_1?: string | null
          button_gradient_color_2?: string | null
          career_benefits?: string | null
          career_url?: string
          collection_ids?: string[] | null
          company_size?: string | null
          core_strength?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          future_direction?: string | null
          gradient_angle?: number | null
          gradient_color_1?: string | null
          gradient_color_2?: string | null
          headcount?: string | null
          hiring_technologies?: string | null
          hq?: string | null
          hq_city?: string | null
          hq_country?: string | null
          hr_contact?: string | null
          id?: string
          industry?: string | null
          is_favorite?: boolean
          is_pinned?: boolean
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          notable_products?: string | null
          notes?: string | null
          organization_strength?: string | null
          stage?: string | null
          technologies?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          application_status?: string | null
          applied_date?: string | null
          brand_color?: string | null
          brand_title_html?: string | null
          button_gradient_angle?: number | null
          button_gradient_color_1?: string | null
          button_gradient_color_2?: string | null
          career_benefits?: string | null
          career_url?: string
          collection_ids?: string[] | null
          company_size?: string | null
          core_strength?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          future_direction?: string | null
          gradient_angle?: number | null
          gradient_color_1?: string | null
          gradient_color_2?: string | null
          headcount?: string | null
          hiring_technologies?: string | null
          hq?: string | null
          hq_city?: string | null
          hq_country?: string | null
          hr_contact?: string | null
          id?: string
          industry?: string | null
          is_favorite?: boolean
          is_pinned?: boolean
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          notable_products?: string | null
          notes?: string | null
          organization_strength?: string | null
          stage?: string | null
          technologies?: string[] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      portals: {
        Row: {
          category: string
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          is_favorite: boolean
          name: string
          region: string | null
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          name: string
          region?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean
          name?: string
          region?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

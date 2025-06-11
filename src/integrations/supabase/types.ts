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
      content: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      feedback: {
        Row: {
          attempt_id: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          question_id: number | null
          rating: number
          user_name: string | null
        }
        Insert: {
          attempt_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          question_id?: number | null
          rating: number
          user_name?: string | null
        }
        Update: {
          attempt_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          question_id?: number | null
          rating?: number
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      question_results: {
        Row: {
          attempt_id: string
          created_at: string | null
          id: string
          is_correct: boolean
          question_id: number
          section: string
        }
        Insert: {
          attempt_id: string
          created_at?: string | null
          id?: string
          is_correct: boolean
          question_id: number
          section: string
        }
        Update: {
          attempt_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: number
          section?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_results_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          created_at: string | null
          id: string
          score: number
          score_percentage: number
          total_questions: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          score: number
          score_percentage: number
          total_questions: number
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number
          score_percentage?: number
          total_questions?: number
        }
        Relationships: []
      }
      slideshow_configs: {
        Row: {
          config: Json
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      welsh_feedback: {
        Row: {
          attempt_id: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          question_id: number | null
          rating: number
          user_name: string | null
        }
        Insert: {
          attempt_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          question_id?: number | null
          rating: number
          user_name?: string | null
        }
        Update: {
          attempt_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          question_id?: number | null
          rating?: number
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "welsh_feedback_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "welsh_quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      welsh_question_results: {
        Row: {
          attempt_id: string
          created_at: string | null
          id: string
          is_correct: boolean
          question_id: number
          section: string
        }
        Insert: {
          attempt_id: string
          created_at?: string | null
          id?: string
          is_correct: boolean
          question_id: number
          section: string
        }
        Update: {
          attempt_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: number
          section?: string
        }
        Relationships: [
          {
            foreignKeyName: "welsh_question_results_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "welsh_quiz_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      welsh_quiz_attempts: {
        Row: {
          created_at: string
          id: string
          score: number
          score_percentage: number
          total_questions: number
        }
        Insert: {
          created_at?: string
          id?: string
          score: number
          score_percentage: number
          total_questions: number
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          score_percentage?: number
          total_questions?: number
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
    Enums: {},
  },
} as const

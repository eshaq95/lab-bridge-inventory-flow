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
      aktivitet_logg: {
        Row: {
          beskrivelse: string | null
          id: number
          item_navn: string
          timestamp: string
          type: string
        }
        Insert: {
          beskrivelse?: string | null
          id?: number
          item_navn: string
          timestamp?: string
          type: string
        }
        Update: {
          beskrivelse?: string | null
          id?: number
          item_navn?: string
          timestamp?: string
          type?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          resolved: boolean | null
          vare_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          resolved?: boolean | null
          vare_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          resolved?: boolean | null
          vare_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_vare_id_fkey"
            columns: ["vare_id"]
            isOneToOne: false
            referencedRelation: "varer"
            referencedColumns: ["id"]
          },
        ]
      }
      kategorier: {
        Row: {
          beskrivelse: string | null
          created_at: string | null
          id: number
          navn: string
        }
        Insert: {
          beskrivelse?: string | null
          created_at?: string | null
          id?: number
          navn: string
        }
        Update: {
          beskrivelse?: string | null
          created_at?: string | null
          id?: number
          navn?: string
        }
        Relationships: []
      }
      leverandorer: {
        Row: {
          adresse: string | null
          created_at: string | null
          epost: string | null
          id: number
          kontaktperson: string | null
          navn: string
          telefon: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          epost?: string | null
          id?: number
          kontaktperson?: string | null
          navn: string
          telefon?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          epost?: string | null
          id?: number
          kontaktperson?: string | null
          navn?: string
          telefon?: string | null
        }
        Relationships: []
      }
      transaksjoner: {
        Row: {
          antall: number
          bruker: string | null
          id: number
          kommentar: string | null
          timestamp: string | null
          type: string
          vare_id: number | null
        }
        Insert: {
          antall: number
          bruker?: string | null
          id?: number
          kommentar?: string | null
          timestamp?: string | null
          type: string
          vare_id?: number | null
        }
        Update: {
          antall?: number
          bruker?: string | null
          id?: number
          kommentar?: string | null
          timestamp?: string | null
          type?: string
          vare_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaksjoner_vare_id_fkey"
            columns: ["vare_id"]
            isOneToOne: false
            referencedRelation: "varer"
            referencedColumns: ["id"]
          },
        ]
      }
      varer: {
        Row: {
          aktiv: boolean | null
          beholdning: number | null
          beskrivelse: string | null
          created_at: string | null
          enhet: string | null
          id: number
          kategori: string | null
          leverandor: string | null
          min_niva: number | null
          navn: string
          pris: number | null
          sist_endret: string | null
          strekkode: string | null
          utlopsdato: string | null
        }
        Insert: {
          aktiv?: boolean | null
          beholdning?: number | null
          beskrivelse?: string | null
          created_at?: string | null
          enhet?: string | null
          id?: number
          kategori?: string | null
          leverandor?: string | null
          min_niva?: number | null
          navn: string
          pris?: number | null
          sist_endret?: string | null
          strekkode?: string | null
          utlopsdato?: string | null
        }
        Update: {
          aktiv?: boolean | null
          beholdning?: number | null
          beskrivelse?: string | null
          created_at?: string | null
          enhet?: string | null
          id?: number
          kategori?: string | null
          leverandor?: string | null
          min_niva?: number | null
          navn?: string
          pris?: number | null
          sist_endret?: string | null
          strekkode?: string | null
          utlopsdato?: string | null
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

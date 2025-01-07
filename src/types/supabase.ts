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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Avatar: {
        Row: {
          customerId: string | null
          freelancerId: string | null
          id: string
          image: string
        }
        Insert: {
          customerId?: string | null
          freelancerId?: string | null
          id: string
          image: string
        }
        Update: {
          customerId?: string | null
          freelancerId?: string | null
          id?: string
          image?: string
        }
        Relationships: [
          {
            foreignKeyName: "Avatar_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Avatar_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
        ]
      }
      Contact: {
        Row: {
          city: string
          country: string
          customerId: string | null
          freelancerId: string | null
          id: string
          phoneNumber: string[] | null
          secondaryEmail: string
          state: string
        }
        Insert: {
          city: string
          country: string
          customerId?: string | null
          freelancerId?: string | null
          id: string
          phoneNumber?: string[] | null
          secondaryEmail: string
          state: string
        }
        Update: {
          city?: string
          country?: string
          customerId?: string | null
          freelancerId?: string | null
          id?: string
          phoneNumber?: string[] | null
          secondaryEmail?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "Contact_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Contact_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
        ]
      }
      Customer: {
        Row: {
          email: string
          firstName: string
          id: string
          lastName: string
          middleName: string | null
          username: string
        }
        Insert: {
          email: string
          firstName: string
          id: string
          lastName: string
          middleName?: string | null
          username: string
        }
        Update: {
          email?: string
          firstName?: string
          id?: string
          lastName?: string
          middleName?: string | null
          username?: string
        }
        Relationships: []
      }
      Freelancer: {
        Row: {
          availibility: boolean
          dailyRate: number | null
          description: string | null
          email: string
          firstName: string
          hourlyRate: number | null
          id: string
          lastName: string
          middleName: string | null
          username: string
        }
        Insert: {
          availibility?: boolean
          dailyRate?: number | null
          description?: string | null
          email: string
          firstName: string
          hourlyRate?: number | null
          id: string
          lastName: string
          middleName?: string | null
          username: string
        }
        Update: {
          availibility?: boolean
          dailyRate?: number | null
          description?: string | null
          email?: string
          firstName?: string
          hourlyRate?: number | null
          id?: string
          lastName?: string
          middleName?: string | null
          username?: string
        }
        Relationships: []
      }
      Otp: {
        Row: {
          createdAt: string
          email: string
          expiresAt: string
          id: number
          otp: string
          sessionId: string
        }
        Insert: {
          createdAt?: string
          email: string
          expiresAt: string
          id?: number
          otp: string
          sessionId: string
        }
        Update: {
          createdAt?: string
          email?: string
          expiresAt?: string
          id?: number
          otp?: string
          sessionId?: string
        }
        Relationships: []
      }
      porposal: {
        Row: {
          freelancerId: string
          id: string
          postId: string
        }
        Insert: {
          freelancerId: string
          id: string
          postId: string
        }
        Update: {
          freelancerId?: string
          id?: string
          postId?: string
        }
        Relationships: [
          {
            foreignKeyName: "porposal_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "porposal_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
        ]
      }
      Post: {
        Row: {
          caption: string
          customerId: string | null
          dailyRate: number | null
          description: string
          estimatedTime: number
          fixedRate: number | null
          id: string
          image: string | null
          location: string
          paymentMode: Database["public"]["Enums"]["PaymentMode"]
          postedAt: string
          requiredSkills: string[] | null
          timeUnit: Database["public"]["Enums"]["estimatedTimeUnit"]
        }
        Insert: {
          caption: string
          customerId?: string | null
          dailyRate?: number | null
          description: string
          estimatedTime: number
          fixedRate?: number | null
          id: string
          image?: string | null
          location: string
          paymentMode: Database["public"]["Enums"]["PaymentMode"]
          postedAt?: string
          requiredSkills?: string[] | null
          timeUnit: Database["public"]["Enums"]["estimatedTimeUnit"]
        }
        Update: {
          caption?: string
          customerId?: string | null
          dailyRate?: number | null
          description?: string
          estimatedTime?: number
          fixedRate?: number | null
          id?: string
          image?: string | null
          location?: string
          paymentMode?: Database["public"]["Enums"]["PaymentMode"]
          postedAt?: string
          requiredSkills?: string[] | null
          timeUnit?: Database["public"]["Enums"]["estimatedTimeUnit"]
        }
        Relationships: [
          {
            foreignKeyName: "Post_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          createdAt: string
          customerId: string | null
          expireDate: string
          freelancerId: string | null
          id: string
          token: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          customerId?: string | null
          expireDate: string
          freelancerId?: string | null
          id: string
          token: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          customerId?: string | null
          expireDate?: string
          freelancerId?: string | null
          id?: string
          token?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Session_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
        ]
      }
      SkillSet: {
        Row: {
          freelancerId: string | null
          id: string
          skillName: string
        }
        Insert: {
          freelancerId?: string | null
          id: string
          skillName: string
        }
        Update: {
          freelancerId?: string | null
          id?: string
          skillName?: string
        }
        Relationships: [
          {
            foreignKeyName: "SkillSet_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkExperience: {
        Row: {
          companyName: string
          designation: string
          endDate: string | null
          freelancerId: string | null
          id: string
          joinedDate: string
          location: string
        }
        Insert: {
          companyName: string
          designation: string
          endDate?: string | null
          freelancerId?: string | null
          id: string
          joinedDate: string
          location: string
        }
        Update: {
          companyName?: string
          designation?: string
          endDate?: string | null
          freelancerId?: string | null
          id?: string
          joinedDate?: string
          location?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkExperience_freelancerId_fkey"
            columns: ["freelancerId"]
            isOneToOne: false
            referencedRelation: "Freelancer"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estimatedTimeUnit: "HOUR" | "DAY" | "WEEK" | "MONTH"
      PaymentMode: "DAILY" | "FIXED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

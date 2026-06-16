/**
 * Tipos gerados via `supabase gen types typescript --linked`.
 * Este arquivo será substituído automaticamente após a Etapa 1 (setup do banco).
 * Por ora, exporta um placeholder para que o restante do monorepo compile.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

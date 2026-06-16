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
      artists: {
        Row: {
          bio_en: string | null
          bio_fr: string | null
          bio_pt: string | null
          birth_place: string | null
          birth_year: number | null
          content_hash: string | null
          created_at: string
          death_year: number | null
          external_refs: Json | null
          hero_image_url: string | null
          id: string
          is_published: boolean
          market_notes_pt: string | null
          name: string
          nationality: string | null
          needs_retranslation: boolean
          schools: string[] | null
          signatures: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          bio_en?: string | null
          bio_fr?: string | null
          bio_pt?: string | null
          birth_place?: string | null
          birth_year?: number | null
          content_hash?: string | null
          created_at?: string
          death_year?: number | null
          external_refs?: Json | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          market_notes_pt?: string | null
          name: string
          nationality?: string | null
          needs_retranslation?: boolean
          schools?: string[] | null
          signatures?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          bio_en?: string | null
          bio_fr?: string | null
          bio_pt?: string | null
          birth_place?: string | null
          birth_year?: number | null
          content_hash?: string | null
          created_at?: string
          death_year?: number | null
          external_refs?: Json | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          market_notes_pt?: string | null
          name?: string
          nationality?: string | null
          needs_retranslation?: boolean
          schools?: string[] | null
          signatures?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      auction_comparables: {
        Row: {
          artist_id: string | null
          auction_date: string
          auction_house: string
          created_at: string
          currency: string
          currency_at_brl: number | null
          estimate_high: number | null
          estimate_low: number | null
          hammer_price: number | null
          height_cm: number | null
          id: string
          image_url: string | null
          lot_number: string | null
          notes: string | null
          scraped_at: string | null
          source_url: string | null
          technique: string | null
          width_cm: number | null
          work_title: string | null
          work_year: number | null
        }
        Insert: {
          artist_id?: string | null
          auction_date: string
          auction_house: string
          created_at?: string
          currency?: string
          currency_at_brl?: number | null
          estimate_high?: number | null
          estimate_low?: number | null
          hammer_price?: number | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          lot_number?: string | null
          notes?: string | null
          scraped_at?: string | null
          source_url?: string | null
          technique?: string | null
          width_cm?: number | null
          work_title?: string | null
          work_year?: number | null
        }
        Update: {
          artist_id?: string | null
          auction_date?: string
          auction_house?: string
          created_at?: string
          currency?: string
          currency_at_brl?: number | null
          estimate_high?: number | null
          estimate_low?: number | null
          hammer_price?: number | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          lot_number?: string | null
          notes?: string | null
          scraped_at?: string | null
          source_url?: string | null
          technique?: string | null
          width_cm?: number | null
          work_title?: string | null
          work_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_comparables_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      boletim_posts: {
        Row: {
          author: string | null
          category: string
          content_en: string | null
          content_fr: string | null
          content_hash: string | null
          content_pt: string
          created_at: string
          excerpt_en: string | null
          excerpt_fr: string | null
          excerpt_pt: string | null
          hero_image_url: string | null
          id: string
          is_published: boolean
          needs_retranslation: boolean
          published_at: string | null
          related_artists: string[] | null
          related_pieces: string[] | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title_en: string | null
          title_fr: string | null
          title_pt: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author?: string | null
          category: string
          content_en?: string | null
          content_fr?: string | null
          content_hash?: string | null
          content_pt: string
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          excerpt_pt?: string | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          needs_retranslation?: boolean
          published_at?: string | null
          related_artists?: string[] | null
          related_pieces?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title_en?: string | null
          title_fr?: string | null
          title_pt: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string | null
          category?: string
          content_en?: string | null
          content_fr?: string | null
          content_hash?: string | null
          content_pt?: string
          created_at?: string
          excerpt_en?: string | null
          excerpt_fr?: string | null
          excerpt_pt?: string | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          needs_retranslation?: boolean
          published_at?: string | null
          related_artists?: string[] | null
          related_pieces?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title_en?: string | null
          title_fr?: string | null
          title_pt?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      cnart_reports: {
        Row: {
          created_at: string
          export_url: string | null
          id: string
          notes: string | null
          period_end: string
          period_start: string
          pieces_count: number
          submitted_by: string | null
          submitted_to_iphan_at: string | null
        }
        Insert: {
          created_at?: string
          export_url?: string | null
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          pieces_count: number
          submitted_by?: string | null
          submitted_to_iphan_at?: string | null
        }
        Update: {
          created_at?: string
          export_url?: string | null
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          pieces_count?: number
          submitted_by?: string | null
          submitted_to_iphan_at?: string | null
        }
        Relationships: []
      }
      coaf_communications: {
        Row: {
          amount_brl: number | null
          communication_type: string
          created_at: string
          description: string | null
          id: string
          notes: string | null
          protocol_number: string | null
          sale_id: string | null
          submitted_at: string | null
        }
        Insert: {
          amount_brl?: number | null
          communication_type: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          protocol_number?: string | null
          sale_id?: string | null
          submitted_at?: string | null
        }
        Update: {
          amount_brl?: number | null
          communication_type?: string
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          protocol_number?: string | null
          sale_id?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaf_communications_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          event_type: string
          id: string
          lead_id: string
          metadata: Json | null
          occurred_at: string
          piece_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          lead_id: string
          metadata?: Json | null
          occurred_at?: string
          piece_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          occurred_at?: string
          piece_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          buyer_profile: Database["public"]["Enums"]["buyer_profile"] | null
          consent_at: string | null
          consent_ip: string | null
          consent_marketing: boolean
          created_at: string
          email: string | null
          first_touch_at: string
          id: string
          landing_page: string | null
          last_touch_at: string
          name: string
          notes_internal: string | null
          phone: string | null
          piece_id: string | null
          referrer: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          viewing_room_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          buyer_profile?: Database["public"]["Enums"]["buyer_profile"] | null
          consent_at?: string | null
          consent_ip?: string | null
          consent_marketing?: boolean
          created_at?: string
          email?: string | null
          first_touch_at?: string
          id?: string
          landing_page?: string | null
          last_touch_at?: string
          name: string
          notes_internal?: string | null
          phone?: string | null
          piece_id?: string | null
          referrer?: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewing_room_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          buyer_profile?: Database["public"]["Enums"]["buyer_profile"] | null
          consent_at?: string | null
          consent_ip?: string | null
          consent_marketing?: boolean
          created_at?: string
          email?: string | null
          first_touch_at?: string
          id?: string
          landing_page?: string | null
          last_touch_at?: string
          name?: string
          notes_internal?: string | null
          phone?: string | null
          piece_id?: string | null
          referrer?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          viewing_room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmed_at: string | null
          consent_ip: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          language: Database["public"]["Enums"]["language_code"]
          name: string | null
          source: Database["public"]["Enums"]["lead_source"] | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed_at?: string | null
          consent_ip?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["language_code"]
          name?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed_at?: string | null
          consent_ip?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          language?: Database["public"]["Enums"]["language_code"]
          name?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      piece_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          is_public: boolean
          issued_at: string | null
          issued_by: string | null
          notes: string | null
          piece_id: string | null
          storage_path: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          id?: string
          is_public?: boolean
          issued_at?: string | null
          issued_by?: string | null
          notes?: string | null
          piece_id?: string | null
          storage_path: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          is_public?: boolean
          issued_at?: string | null
          issued_by?: string | null
          notes?: string | null
          piece_id?: string | null
          storage_path?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "piece_documents_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      piece_images: {
        Row: {
          alt_text_pt: string | null
          bytes: number | null
          caption_pt: string | null
          created_at: string
          height_px: number | null
          id: string
          image_type: string
          is_primary: boolean
          piece_id: string
          sort_order: number
          storage_path: string
          url_large: string | null
          url_medium: string | null
          url_original: string
          url_thumbnail: string | null
          width_px: number | null
        }
        Insert: {
          alt_text_pt?: string | null
          bytes?: number | null
          caption_pt?: string | null
          created_at?: string
          height_px?: number | null
          id?: string
          image_type?: string
          is_primary?: boolean
          piece_id: string
          sort_order?: number
          storage_path: string
          url_large?: string | null
          url_medium?: string | null
          url_original: string
          url_thumbnail?: string | null
          width_px?: number | null
        }
        Update: {
          alt_text_pt?: string | null
          bytes?: number | null
          caption_pt?: string | null
          created_at?: string
          height_px?: number | null
          id?: string
          image_type?: string
          is_primary?: boolean
          piece_id?: string
          sort_order?: number
          storage_path?: string
          url_large?: string | null
          url_medium?: string | null
          url_original?: string
          url_thumbnail?: string | null
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "piece_images_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      pieces: {
        Row: {
          acquired_from: string | null
          acquisition_date: string | null
          artist_id: string | null
          attribution: Database["public"]["Enums"]["attribution_role"]
          bibliography_pt: string | null
          category: Database["public"]["Enums"]["piece_category"]
          cnart_reported_at: string | null
          condition_notes_pt: string | null
          condition_pt: string | null
          consignor_commission: number | null
          consignor_confidential: boolean | null
          consignor_contact: string | null
          consignor_name: string | null
          content_hash: string | null
          created_at: string
          curator_notes_pt: string | null
          depth_cm: number | null
          description_en: string | null
          description_fr: string | null
          description_pt: string | null
          embedding: string | null
          exhibition_history_pt: string | null
          featured: boolean
          has_restoration: boolean | null
          height_cm: number | null
          id: string
          internal_code: string
          iphan_notes: string | null
          iphan_restricted: boolean | null
          is_dated_on_piece: boolean | null
          is_signed: boolean | null
          needs_retranslation: boolean
          origin: Database["public"]["Enums"]["piece_origin"]
          period_label: string | null
          price_brl: number | null
          price_visibility: string
          provenance_en: string | null
          provenance_fr: string | null
          provenance_pt: string | null
          published_at: string | null
          restoration_notes_pt: string | null
          seo_description_pt: string | null
          seo_title_pt: string | null
          signature_location: string | null
          slug: string
          sold_at: string | null
          status: Database["public"]["Enums"]["piece_status"]
          technique_en: string | null
          technique_fr: string | null
          technique_pt: string | null
          title_en: string | null
          title_fr: string | null
          title_pt: string
          updated_at: string
          view_count: number
          weight_kg: number | null
          width_cm: number | null
          year_created: number | null
          year_created_circa: boolean | null
        }
        Insert: {
          acquired_from?: string | null
          acquisition_date?: string | null
          artist_id?: string | null
          attribution?: Database["public"]["Enums"]["attribution_role"]
          bibliography_pt?: string | null
          category: Database["public"]["Enums"]["piece_category"]
          cnart_reported_at?: string | null
          condition_notes_pt?: string | null
          condition_pt?: string | null
          consignor_commission?: number | null
          consignor_confidential?: boolean | null
          consignor_contact?: string | null
          consignor_name?: string | null
          content_hash?: string | null
          created_at?: string
          curator_notes_pt?: string | null
          depth_cm?: number | null
          description_en?: string | null
          description_fr?: string | null
          description_pt?: string | null
          embedding?: string | null
          exhibition_history_pt?: string | null
          featured?: boolean
          has_restoration?: boolean | null
          height_cm?: number | null
          id?: string
          internal_code: string
          iphan_notes?: string | null
          iphan_restricted?: boolean | null
          is_dated_on_piece?: boolean | null
          is_signed?: boolean | null
          needs_retranslation?: boolean
          origin: Database["public"]["Enums"]["piece_origin"]
          period_label?: string | null
          price_brl?: number | null
          price_visibility?: string
          provenance_en?: string | null
          provenance_fr?: string | null
          provenance_pt?: string | null
          published_at?: string | null
          restoration_notes_pt?: string | null
          seo_description_pt?: string | null
          seo_title_pt?: string | null
          signature_location?: string | null
          slug: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["piece_status"]
          technique_en?: string | null
          technique_fr?: string | null
          technique_pt?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_pt: string
          updated_at?: string
          view_count?: number
          weight_kg?: number | null
          width_cm?: number | null
          year_created?: number | null
          year_created_circa?: boolean | null
        }
        Update: {
          acquired_from?: string | null
          acquisition_date?: string | null
          artist_id?: string | null
          attribution?: Database["public"]["Enums"]["attribution_role"]
          bibliography_pt?: string | null
          category?: Database["public"]["Enums"]["piece_category"]
          cnart_reported_at?: string | null
          condition_notes_pt?: string | null
          condition_pt?: string | null
          consignor_commission?: number | null
          consignor_confidential?: boolean | null
          consignor_contact?: string | null
          consignor_name?: string | null
          content_hash?: string | null
          created_at?: string
          curator_notes_pt?: string | null
          depth_cm?: number | null
          description_en?: string | null
          description_fr?: string | null
          description_pt?: string | null
          embedding?: string | null
          exhibition_history_pt?: string | null
          featured?: boolean
          has_restoration?: boolean | null
          height_cm?: number | null
          id?: string
          internal_code?: string
          iphan_notes?: string | null
          iphan_restricted?: boolean | null
          is_dated_on_piece?: boolean | null
          is_signed?: boolean | null
          needs_retranslation?: boolean
          origin?: Database["public"]["Enums"]["piece_origin"]
          period_label?: string | null
          price_brl?: number | null
          price_visibility?: string
          provenance_en?: string | null
          provenance_fr?: string | null
          provenance_pt?: string | null
          published_at?: string | null
          restoration_notes_pt?: string | null
          seo_description_pt?: string | null
          seo_title_pt?: string | null
          signature_location?: string | null
          slug?: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["piece_status"]
          technique_en?: string | null
          technique_fr?: string | null
          technique_pt?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_pt?: string
          updated_at?: string
          view_count?: number
          weight_kg?: number | null
          width_cm?: number | null
          year_created?: number | null
          year_created_circa?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pieces_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      provenance_executions: {
        Row: {
          completed_at: string | null
          confidence_score: number | null
          cost_usd: number | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          executed_by: string
          id: string
          inputs: Json
          output_pdf_url: string | null
          output_report: Json | null
          piece_id: string | null
          source_type: string
          sourcing_lead_id: string | null
          status: string
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          completed_at?: string | null
          confidence_score?: number | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          executed_by: string
          id?: string
          inputs: Json
          output_pdf_url?: string | null
          output_report?: Json | null
          piece_id?: string | null
          source_type: string
          sourcing_lead_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          completed_at?: string | null
          confidence_score?: number | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          executed_by?: string
          id?: string
          inputs?: Json
          output_pdf_url?: string | null
          output_report?: Json | null
          piece_id?: string | null
          source_type?: string
          sourcing_lead_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "provenance_executions_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provenance_executions_sourcing_lead_id_fkey"
            columns: ["sourcing_lead_id"]
            isOneToOne: false
            referencedRelation: "sourcing_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          agreed_price_brl: number
          approval_deadline: string | null
          approved_at: string | null
          buyer_address: Json | null
          buyer_cpf_cnpj: string | null
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string | null
          certificate_url: string | null
          closed_at: string | null
          cnart_reported: boolean
          coaf_communication: boolean
          coaf_communication_at: string | null
          contract_url: string | null
          created_at: string
          delivered_at: string | null
          digital_attributed: boolean
          digital_attribution_notes: string | null
          executor_commission_brl: number | null
          executor_commission_pct: number | null
          final_amount_brl: number | null
          final_payment_at: string | null
          id: string
          invoice_url: string | null
          iphan_consult_protocol: string | null
          iphan_export_consult: boolean | null
          kyc_document_url: string | null
          kyc_proof_residence_url: string | null
          kyc_selfie_url: string | null
          kyc_validated_at: string | null
          kyc_validated_by: string | null
          lead_id: string | null
          notes_internal: string | null
          payment_method: string | null
          piece_id: string
          shipped_at: string | null
          shipping_carrier: string | null
          shipping_insurance_brl: number | null
          shipping_tracking: string | null
          signal_amount_brl: number | null
          signal_paid_at: string | null
          status: Database["public"]["Enums"]["sale_status"]
          unboxing_video_url: string | null
          updated_at: string
        }
        Insert: {
          agreed_price_brl: number
          approval_deadline?: string | null
          approved_at?: string | null
          buyer_address?: Json | null
          buyer_cpf_cnpj?: string | null
          buyer_email?: string | null
          buyer_name: string
          buyer_phone?: string | null
          certificate_url?: string | null
          closed_at?: string | null
          cnart_reported?: boolean
          coaf_communication?: boolean
          coaf_communication_at?: string | null
          contract_url?: string | null
          created_at?: string
          delivered_at?: string | null
          digital_attributed?: boolean
          digital_attribution_notes?: string | null
          executor_commission_brl?: number | null
          executor_commission_pct?: number | null
          final_amount_brl?: number | null
          final_payment_at?: string | null
          id?: string
          invoice_url?: string | null
          iphan_consult_protocol?: string | null
          iphan_export_consult?: boolean | null
          kyc_document_url?: string | null
          kyc_proof_residence_url?: string | null
          kyc_selfie_url?: string | null
          kyc_validated_at?: string | null
          kyc_validated_by?: string | null
          lead_id?: string | null
          notes_internal?: string | null
          payment_method?: string | null
          piece_id: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_insurance_brl?: number | null
          shipping_tracking?: string | null
          signal_amount_brl?: number | null
          signal_paid_at?: string | null
          status?: Database["public"]["Enums"]["sale_status"]
          unboxing_video_url?: string | null
          updated_at?: string
        }
        Update: {
          agreed_price_brl?: number
          approval_deadline?: string | null
          approved_at?: string | null
          buyer_address?: Json | null
          buyer_cpf_cnpj?: string | null
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          certificate_url?: string | null
          closed_at?: string | null
          cnart_reported?: boolean
          coaf_communication?: boolean
          coaf_communication_at?: string | null
          contract_url?: string | null
          created_at?: string
          delivered_at?: string | null
          digital_attributed?: boolean
          digital_attribution_notes?: string | null
          executor_commission_brl?: number | null
          executor_commission_pct?: number | null
          final_amount_brl?: number | null
          final_payment_at?: string | null
          id?: string
          invoice_url?: string | null
          iphan_consult_protocol?: string | null
          iphan_export_consult?: boolean | null
          kyc_document_url?: string | null
          kyc_proof_residence_url?: string | null
          kyc_selfie_url?: string | null
          kyc_validated_at?: string | null
          kyc_validated_by?: string | null
          lead_id?: string | null
          notes_internal?: string | null
          payment_method?: string | null
          piece_id?: string
          shipped_at?: string | null
          shipping_carrier?: string | null
          shipping_insurance_brl?: number | null
          shipping_tracking?: string | null
          signal_amount_brl?: number | null
          signal_paid_at?: string | null
          status?: Database["public"]["Enums"]["sale_status"]
          unboxing_video_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      sourcing_leads: {
        Row: {
          acquisition_history: string | null
          artist_claimed: string | null
          assigned_to: string | null
          consent_at: string | null
          consent_data: boolean
          created_at: string
          dimensions_claimed: string | null
          documents_description: string | null
          executor_captured: boolean
          expected_value_brl: number | null
          has_documents: boolean | null
          id: string
          notes_internal: string | null
          photos: Json | null
          preliminary_estimate_brl: number | null
          proposal_amount_brl: number | null
          proposal_type: string | null
          provenance_report_url: string | null
          resulted_in_piece_id: string | null
          seller_city: string | null
          seller_email: string | null
          seller_name: string
          seller_phone: string | null
          seller_state: string | null
          status: string
          technique_claimed: string | null
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          year_claimed: string | null
        }
        Insert: {
          acquisition_history?: string | null
          artist_claimed?: string | null
          assigned_to?: string | null
          consent_at?: string | null
          consent_data?: boolean
          created_at?: string
          dimensions_claimed?: string | null
          documents_description?: string | null
          executor_captured?: boolean
          expected_value_brl?: number | null
          has_documents?: boolean | null
          id?: string
          notes_internal?: string | null
          photos?: Json | null
          preliminary_estimate_brl?: number | null
          proposal_amount_brl?: number | null
          proposal_type?: string | null
          provenance_report_url?: string | null
          resulted_in_piece_id?: string | null
          seller_city?: string | null
          seller_email?: string | null
          seller_name: string
          seller_phone?: string | null
          seller_state?: string | null
          status?: string
          technique_claimed?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          year_claimed?: string | null
        }
        Update: {
          acquisition_history?: string | null
          artist_claimed?: string | null
          assigned_to?: string | null
          consent_at?: string | null
          consent_data?: boolean
          created_at?: string
          dimensions_claimed?: string | null
          documents_description?: string | null
          executor_captured?: boolean
          expected_value_brl?: number | null
          has_documents?: boolean | null
          id?: string
          notes_internal?: string | null
          photos?: Json | null
          preliminary_estimate_brl?: number | null
          proposal_amount_brl?: number | null
          proposal_type?: string | null
          provenance_report_url?: string | null
          resulted_in_piece_id?: string | null
          seller_city?: string | null
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string | null
          seller_state?: string | null
          status?: string
          technique_claimed?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          year_claimed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sourcing_leads_resulted_in_piece_id_fkey"
            columns: ["resulted_in_piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          content_hash: string
          cost_usd: number | null
          id: string
          language: Database["public"]["Enums"]["language_code"]
          source_field: string
          source_id: string
          source_table: string
          tokens_used: number | null
          translated_at: string
          translated_text: string
        }
        Insert: {
          content_hash: string
          cost_usd?: number | null
          id?: string
          language: Database["public"]["Enums"]["language_code"]
          source_field: string
          source_id: string
          source_table: string
          tokens_used?: number | null
          translated_at?: string
          translated_text: string
        }
        Update: {
          content_hash?: string
          cost_usd?: number | null
          id?: string
          language?: Database["public"]["Enums"]["language_code"]
          source_field?: string
          source_id?: string
          source_table?: string
          tokens_used?: number | null
          translated_at?: string
          translated_text?: string
        }
        Relationships: []
      }
      viewing_room_events: {
        Row: {
          client_ip: unknown
          duration_seconds: number | null
          event_type: string
          id: string
          metadata: Json | null
          occurred_at: string
          piece_id: string | null
          user_agent: string | null
          viewing_room_id: string
        }
        Insert: {
          client_ip?: unknown
          duration_seconds?: number | null
          event_type: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          piece_id?: string | null
          user_agent?: string | null
          viewing_room_id: string
        }
        Update: {
          client_ip?: unknown
          duration_seconds?: number | null
          event_type?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          piece_id?: string | null
          user_agent?: string | null
          viewing_room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_room_events_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_room_events_viewing_room_id_fkey"
            columns: ["viewing_room_id"]
            isOneToOne: false
            referencedRelation: "viewing_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_room_pieces: {
        Row: {
          curator_note_pt: string | null
          piece_id: string
          sort_order: number
          viewing_room_id: string
        }
        Insert: {
          curator_note_pt?: string | null
          piece_id: string
          sort_order?: number
          viewing_room_id: string
        }
        Update: {
          curator_note_pt?: string | null
          piece_id?: string
          sort_order?: number
          viewing_room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_room_pieces_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_room_pieces_viewing_room_id_fkey"
            columns: ["viewing_room_id"]
            isOneToOne: false
            referencedRelation: "viewing_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      viewing_rooms: {
        Row: {
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string
          expires_at: string
          id: string
          is_active: boolean
          message_en: string | null
          message_fr: string | null
          message_pt: string | null
          notes_internal: string | null
          token: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          is_active?: boolean
          message_en?: string | null
          message_fr?: string | null
          message_pt?: string | null
          notes_internal?: string | null
          token: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          message_en?: string | null
          message_fr?: string | null
          message_pt?: string | null
          notes_internal?: string | null
          token?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          bot_active: boolean
          contact_name: string | null
          created_at: string
          handed_off_at: string | null
          handoff_reason: string | null
          id: string
          last_message_at: string | null
          lead_id: string | null
          phone: string
        }
        Insert: {
          bot_active?: boolean
          contact_name?: string | null
          created_at?: string
          handed_off_at?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          phone: string
        }
        Update: {
          bot_active?: boolean
          contact_name?: string | null
          created_at?: string
          handed_off_at?: string | null
          handoff_reason?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          classified_intent: string | null
          content: string
          conversation_id: string
          direction: string
          id: string
          media_url: string | null
          occurred_at: string
          rag_pieces_used: string[] | null
          sender_type: string
          tokens_used: number | null
        }
        Insert: {
          classified_intent?: string | null
          content: string
          conversation_id: string
          direction: string
          id?: string
          media_url?: string | null
          occurred_at?: string
          rag_pieces_used?: string[] | null
          sender_type: string
          tokens_used?: number | null
        }
        Update: {
          classified_intent?: string | null
          content?: string
          conversation_id?: string
          direction?: string
          id?: string
          media_url?: string | null
          occurred_at?: string
          rag_pieces_used?: string[] | null
          sender_type?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_pieces: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          description_pt: string
          id: string
          internal_code: string
          similarity: number
          title_pt: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      attribution_role:
        | "autoria_confirmada"
        | "atribuida"
        | "circulo_de"
        | "escola_de"
        | "apocrifa"
      buyer_profile:
        | "colecionador"
        | "investidor"
        | "decorador"
        | "arquiteto"
        | "curioso"
        | "instituicao"
        | "nao_informado"
      language_code: "pt-BR" | "en-US" | "fr-FR"
      lead_source:
        | "site_formulario"
        | "whatsapp"
        | "instagram"
        | "google_meu_negocio"
        | "indicacao"
        | "newsletter"
        | "viewing_room"
        | "sourcing_form"
        | "outro"
      lead_status:
        | "novo"
        | "qualificado"
        | "em_negociacao"
        | "ganho"
        | "perdido"
        | "descartado"
      piece_category:
        | "pintura"
        | "escultura"
        | "desenho"
        | "gravura"
        | "fotografia"
        | "objeto"
        | "antiguidade"
      piece_origin: "propria" | "consignada" | "parceria"
      piece_status:
        | "rascunho"
        | "privado"
        | "publico"
        | "reservado"
        | "vendido"
        | "arquivado"
      sale_status:
        | "sinal_pendente"
        | "sinal_pago"
        | "kyc_pendente"
        | "em_transito"
        | "em_aprovacao"
        | "pagamento_final_pendente"
        | "concluida"
        | "cancelada"
        | "devolvida"
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
    Enums: {
      attribution_role: [
        "autoria_confirmada",
        "atribuida",
        "circulo_de",
        "escola_de",
        "apocrifa",
      ],
      buyer_profile: [
        "colecionador",
        "investidor",
        "decorador",
        "arquiteto",
        "curioso",
        "instituicao",
        "nao_informado",
      ],
      language_code: ["pt-BR", "en-US", "fr-FR"],
      lead_source: [
        "site_formulario",
        "whatsapp",
        "instagram",
        "google_meu_negocio",
        "indicacao",
        "newsletter",
        "viewing_room",
        "sourcing_form",
        "outro",
      ],
      lead_status: [
        "novo",
        "qualificado",
        "em_negociacao",
        "ganho",
        "perdido",
        "descartado",
      ],
      piece_category: [
        "pintura",
        "escultura",
        "desenho",
        "gravura",
        "fotografia",
        "objeto",
        "antiguidade",
      ],
      piece_origin: ["propria", "consignada", "parceria"],
      piece_status: [
        "rascunho",
        "privado",
        "publico",
        "reservado",
        "vendido",
        "arquivado",
      ],
      sale_status: [
        "sinal_pendente",
        "sinal_pago",
        "kyc_pendente",
        "em_transito",
        "em_aprovacao",
        "pagamento_final_pendente",
        "concluida",
        "cancelada",
        "devolvida",
      ],
    },
  },
} as const



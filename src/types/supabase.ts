export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          specialist_id: string | null
          user_id: string | null
          appointment_date: string
          duration_minutes: number | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          specialist_id?: string | null
          user_id?: string | null
          appointment_date: string
          duration_minutes?: number | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          specialist_id?: string | null
          user_id?: string | null
          appointment_date?: string
          duration_minutes?: number | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      charity_listings: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string
          image_urls: string[] | null
          condition: string | null
          listing_type: 'donate' | 'exchange' | 'request' | null
          city: string
          district: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_messenger: string | null
          is_active: boolean | null
          is_moderated: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description: string
          image_urls?: string[] | null
          condition?: string | null
          listing_type?: 'donate' | 'exchange' | 'request' | null
          city: string
          district?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_messenger?: string | null
          is_active?: boolean | null
          is_moderated?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string
          image_urls?: string[] | null
          condition?: string | null
          listing_type?: 'donate' | 'exchange' | 'request' | null
          city?: string
          district?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_messenger?: string | null
          is_active?: boolean | null
          is_moderated?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string | null
          content: string
          like_count: number | null
          comment_count: number | null
          is_moderated: boolean | null
          is_visible: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          content: string
          like_count?: number | null
          comment_count?: number | null
          is_moderated?: boolean | null
          is_visible?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          content?: string
          like_count?: number | null
          comment_count?: number | null
          is_moderated?: boolean | null
          is_visible?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      content_tag_relations: {
        Row: {
          content_id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          tag_id: string
        }
        Update: {
          content_id?: string
          tag_id?: string
        }
      }
      content_tags: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
      content_types: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
      educational_content: {
        Row: {
          id: string
          type_id: string | null
          title: string
          description: string | null
          content_url: string | null
          thumbnail_url: string | null
          reading_time_minutes: number | null
          view_count: number | null
          like_count: number | null
          is_published: boolean | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          type_id?: string | null
          title: string
          description?: string | null
          content_url?: string | null
          thumbnail_url?: string | null
          reading_time_minutes?: number | null
          view_count?: number | null
          like_count?: number | null
          is_published?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          type_id?: string | null
          title?: string
          description?: string | null
          content_url?: string | null
          thumbnail_url?: string | null
          reading_time_minutes?: number | null
          view_count?: number | null
          like_count?: number | null
          is_published?: boolean | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string | null
          user_id: string | null
          content: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          content: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          content?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string | null
        }
      }
      post_media: {
        Row: {
          id: string
          post_id: string | null
          media_url: string
          media_type: 'image' | 'video' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          media_url: string
          media_type?: 'image' | 'video' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          media_url?: string
          media_type?: 'image' | 'video' | null
          created_at?: string | null
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          image_url: string | null
          approximate_price: number | null
          contraindications: string | null
          where_to_buy: Json | null
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          image_url?: string | null
          approximate_price?: number | null
          contraindications?: string | null
          where_to_buy?: Json | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          image_url?: string | null
          approximate_price?: number | null
          contraindications?: string | null
          where_to_buy?: Json | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'parent' | 'specialist' | 'admin'
          bio: string | null
          city: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'parent' | 'specialist' | 'admin'
          bio?: string | null
          city?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'parent' | 'specialist' | 'admin'
          bio?: string | null
          city?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      specialist_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string | null
        }
      }
      specialist_certificates: {
        Row: {
          id: string
          specialist_id: string | null
          title: string
          file_url: string
          created_at: string | null
        }
        Insert: {
          id?: string
          specialist_id?: string | null
          title: string
          file_url: string
          created_at?: string | null
        }
        Update: {
          id?: string
          specialist_id?: string | null
          title?: string
          file_url?: string
          created_at?: string | null
        }
      }
      specialist_reviews: {
        Row: {
          id: string
          specialist_id: string | null
          user_id: string | null
          rating: number
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          specialist_id?: string | null
          user_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          specialist_id?: string | null
          user_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string | null
        }
      }
      specialists: {
        Row: {
          id: string
          user_id: string | null
          category_id: string | null
          specialization: string
          about: string | null
          price_per_session: number | null
          experience_years: number | null
          rating: number | null
          review_count: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          category_id?: string | null
          specialization: string
          about?: string | null
          price_per_session?: number | null
          experience_years?: number | null
          rating?: number | null
          review_count?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          category_id?: string | null
          specialization?: string
          about?: string | null
          price_per_session?: number | null
          experience_years?: number | null
          rating?: number | null
          review_count?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wishlists: {
        Row: {
          user_id: string
          product_id: string
          created_at: string | null
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string | null
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      [_: string]: never
    }
    Functions: {
      [_: string]: never
    }
    Enums: {
      [_: string]: never
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          username: string | null;
          full_name: string | null;
          pen_name: string | null;
          avatar_url: string | null;
          account_type: 'reader' | 'author';
          bio: string | null;
          phone: string | null;
          location: string | null;
          // Social links (canonical columns)
          website: string | null;
          twitter: string | null;
          instagram: string | null;
          facebook: string | null;
          linkedin: string | null;
          goodreads: string | null;
          // Author-specific fields
          primary_genre: string | null;
          is_verified: boolean;
          // Deprecated - kept for migration compatibility
          social_links: Json | null;
          notification_settings: Json | null;
          preferences: Json | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          pen_name?: string | null;
          avatar_url?: string | null;
          account_type?: 'reader' | 'author';
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          website?: string | null;
          twitter?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          linkedin?: string | null;
          goodreads?: string | null;
          primary_genre?: string | null;
          is_verified?: boolean;
          social_links?: Json | null;
          notification_settings?: Json | null;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          pen_name?: string | null;
          avatar_url?: string | null;
          account_type?: 'reader' | 'author';
          bio?: string | null;
          phone?: string | null;
          location?: string | null;
          website?: string | null;
          twitter?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          linkedin?: string | null;
          goodreads?: string | null;
          primary_genre?: string | null;
          is_verified?: boolean;
          social_links?: Json | null;
          notification_settings?: Json | null;
          preferences?: Json | null;
        };
      };
      books: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          author_id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image: string | null;
          price: number;
          currency: string;
          genre: string | null;
          tags: string[] | null;
          status: 'draft' | 'pending' | 'published' | 'rejected';
          published_at: string | null;
          page_count: number | null;
          isbn: string | null;
          language: string;
          file_url: string | null;
          preview_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_id: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image?: string | null;
          price?: number;
          currency?: string;
          genre?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'pending' | 'published' | 'rejected';
          published_at?: string | null;
          page_count?: number | null;
          isbn?: string | null;
          language?: string;
          file_url?: string | null;
          preview_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image?: string | null;
          price?: number;
          currency?: string;
          genre?: string | null;
          tags?: string[] | null;
          status?: 'draft' | 'pending' | 'published' | 'rejected';
          published_at?: string | null;
          page_count?: number | null;
          isbn?: string | null;
          language?: string;
          file_url?: string | null;
          preview_url?: string | null;
        };
      };
      purchases: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          book_id: string;
          amount: number;
          currency: string;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider: string | null;
          transaction_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          book_id: string;
          amount: number;
          currency?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider?: string | null;
          transaction_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          book_id?: string;
          amount?: number;
          currency?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_provider?: string | null;
          transaction_id?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          book_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          is_verified_purchase: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          book_id: string;
          rating: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          book_id?: string;
          rating?: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
        };
      };
      wishlists: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          book_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          book_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          book_id?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          created_at: string;
          follower_id: string;
          following_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          follower_id: string;
          following_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          follower_id?: string;
          following_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      account_type: 'reader' | 'author';
      book_status: 'draft' | 'pending' | 'published' | 'rejected';
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Book = Database['public']['Tables']['books']['Row'];
export type Purchase = Database['public']['Tables']['purchases']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Wishlist = Database['public']['Tables']['wishlists']['Row'];
export type Follow = Database['public']['Tables']['follows']['Row'];

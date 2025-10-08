import { createClient } from '@/utlis/supabase/client';
import { BookingDB, BookingInput } from '@/types/events';

/**
 * Service layer for booking database operations
 */
export class BookingService {
  private supabase = createClient();

  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingInput): Promise<BookingDB> {
    // Prepare data for database insertion
    const dbData = {
      client_name: bookingData.client_name,
      client_phone: bookingData.client_phone,
      client_whatsapp: bookingData.client_whatsapp || null,
      client_email: bookingData.client_email || null,
      client_home_address: bookingData.client_home_address || null,
      client_current_location: bookingData.client_current_location || null,
      
      booking_type: bookingData.booking_type,
      event_location: bookingData.event_location,
      event_date: bookingData.event_date,
      guest_count: bookingData.guest_count || null,
      budget_range: bookingData.budget_range || null,
      
      selected_functions: bookingData.selected_functions,
      additional_functions: bookingData.additional_functions,
      
      total_photographers: bookingData.total_photographers,
      total_cinematographers: bookingData.total_cinematographers,
      main_event_start_time: bookingData.main_event_start_time || null,
      main_event_end_time: bookingData.main_event_end_time || null,
      
      album_type: bookingData.album_type,
      album_pages: bookingData.album_pages,
      
      video_addons: bookingData.video_addons,
      complimentary_item: bookingData.complimentary_item || null,
      
      selected_package: bookingData.selected_package || null,
      selected_package_id: bookingData.selected_package_id || null,
      total_price: bookingData.total_price,
      advance_amount: bookingData.advance_amount,
      balance_amount: bookingData.balance_amount,
      pricing_breakdown: bookingData.pricing_breakdown || null,
      
      digital_signature: bookingData.digital_signature,
      terms_accepted: bookingData.terms_accepted,
      terms_accepted_at: new Date().toISOString(),
      
      booking_status: 'pending' as const,
      payment_status: 'unpaid' as const,
    };

    const { data, error } = await this.supabase
      .from('bookings')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<BookingDB | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data;
  }

  /**
   * Get booking by reference number
   */
  async getBookingByReference(reference: string): Promise<BookingDB | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('booking_reference', reference)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data;
  }

  /**
   * Get bookings by phone number
   */
  async getBookingsByPhone(phone: string): Promise<BookingDB[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('client_phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    id: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('bookings')
      .update({ booking_status: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking status:', error);
      return false;
    }

    return true;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    id: string,
    status: 'unpaid' | 'advance_paid' | 'fully_paid' | 'refunded'
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('bookings')
      .update({ payment_status: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating payment status:', error);
      return false;
    }

    return true;
  }

  /**
   * Update PDF information
   */
  async updatePdfInfo(
    id: string,
    pdfUrl: string
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('bookings')
      .update({
        pdf_generated: true,
        pdf_url: pdfUrl,
        pdf_generated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating PDF info:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all bookings (admin only)
   */
  async getAllBookings(limit = 50, offset = 0): Promise<BookingDB[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching all bookings:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get bookings by date range
   */
  async getBookingsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<BookingDB[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings by date range:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Delete booking (admin only)
   */
  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  }
}

// Export a singleton instance
export const bookingService = new BookingService();

import { NextRequest, NextResponse } from 'next/server';
import { bookingService } from '@/services';
import { BookingInput } from '@/types/events';

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    // Optional fields: client_whatsapp, client_email, client_home_address, 
    // client_current_location, event_location, guest_count, budget_range,
    // additional_functions, video_addons, complimentary_item, selected_package
    const requiredFields = [
      'client_name',
      'client_phone',
      'booking_type',
      'event_date',
      'selected_functions',
      'album_type',
      'album_pages',
      'total_price',
      'advance_amount',
      'balance_amount',
      'digital_signature',
      'terms_accepted',
    ];

    const missingFields = requiredFields.filter(field => {
      const value = body[field];
      // Check if field is missing or empty (but allow 0 for numbers)
      if (value === undefined || value === null) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && field === 'selected_functions' && value.length === 0) return true;
      return false;
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate terms accepted
    if (!body.terms_accepted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terms and conditions must be accepted',
        },
        { status: 400 }
      );
    }

    // Prepare booking input
    const bookingInput: BookingInput = {
      client_name: body.client_name,
      client_phone: body.client_phone,
      client_whatsapp: body.client_whatsapp,
      client_email: body.client_email,
      client_home_address: body.client_home_address,
      client_current_location: body.client_current_location,
      
      booking_type: body.booking_type,
      event_location: body.event_location,
      event_date: body.event_date,
      guest_count: body.guest_count,
      budget_range: body.budget_range,
      
      selected_functions: body.selected_functions || [],
      additional_functions: body.additional_functions || [],
      
      total_photographers: body.total_photographers || 0,
      total_cinematographers: body.total_cinematographers || 0,
      main_event_start_time: body.main_event_start_time,
      main_event_end_time: body.main_event_end_time,
      
      album_type: body.album_type,
      album_pages: body.album_pages,
      
      video_addons: body.video_addons || [],
      complimentary_item: body.complimentary_item,
      
      selected_package: body.selected_package,
      selected_package_id: body.selected_package_id,
      total_price: body.total_price,
      advance_amount: body.advance_amount,
      balance_amount: body.balance_amount,
      pricing_breakdown: body.pricing_breakdown,
      
      digital_signature: body.digital_signature,
      terms_accepted: body.terms_accepted,
    };

    // Create booking
    const booking = await bookingService.createBooking(bookingInput);

    return NextResponse.json(
      {
        success: true,
        booking,
        bookingReference: booking.booking_reference,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings?phone=xxx or ?reference=xxx
 * Get bookings by phone number or reference
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get('phone');
    const reference = searchParams.get('reference');

    if (reference) {
      const booking = await bookingService.getBookingByReference(reference);
      
      if (!booking) {
        return NextResponse.json(
          {
            success: false,
            error: 'Booking not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        booking,
      });
    }

    if (phone) {
      const bookings = await bookingService.getBookingsByPhone(phone);
      
      return NextResponse.json({
        success: true,
        bookings,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Please provide either phone or reference parameter',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}

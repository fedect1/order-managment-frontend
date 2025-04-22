// app/api/orders/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    
    // Log the received body to see the reordered array
    console.log('Received reordered data:', body);
    
    // Extract data from the request
    const { lineId, reorderedItems } = body;
    
    if (!lineId || !reorderedItems || !Array.isArray(reorderedItems)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Log the specific reordered array we'll be working with
    console.log('Processing reordered items:', reorderedItems);
    
    // Here you would typically update the sequence numbers in your database
    // This is a simplified example - adjust based on your Prisma schema
    
    // Example: Process each item to update its sequence number
    const updatePromises = reorderedItems.map(async (item, index) => {
      // Skip items with invalid order_id (-1 is our placeholder value)
      if (item.order_id === -1) return null;
      
      // Update the sequence number for this order
      return prisma.t_ng_orders.update({
        where: { 
          order_id: item.order_id
         },
        data: { 
          sequence_number: index + 1 
        }
      });
    });
    
    // Wait for all updates to complete
    await Promise.all(updatePromises);
    
    // Return successful response with updated items
    return NextResponse.json({
      success: true,
      message: 'Order sequence updated successfully',
      data: reorderedItems
    });
    
  } catch (error) {
    console.error('Error updating order sequence:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update order sequence',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
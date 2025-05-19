import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Itinerary from '@/models/Itinerary'

export async function GET(): Promise<Response> {
  try {
    await connectToDatabase()

    // Return latest itinerary first
    const itineraries = await Itinerary.find().sort({ createdDate: -1 }).lean();

    return NextResponse.json(itineraries)
  } catch (error) {
    const errorText = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}

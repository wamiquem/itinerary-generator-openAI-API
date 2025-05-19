import { NextRequest, NextResponse } from 'next/server'
import { ItineraryType } from '@/utils/interface'
import { connectToDatabase } from '@/lib/mongoose'
import Itinerary from '@/models/Itinerary'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ItineraryType = await req.json()
    
    if (!body.prompt || !body.itinerary) {
      return NextResponse.json({ error: 'Missing itinerary data' }, { status: 400 })
    }

    await connectToDatabase()

    const newItinerary = await Itinerary.create(body)

    return NextResponse.json(
      { success: true, data: newItinerary },
      { status: 201 }
    )
  } catch (error) {
    const errorText = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}

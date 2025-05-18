import { NextResponse } from 'next/server'
import { ItineraryType } from '@/utils/interface'
import { connectToDatabase } from '@/lib/mongoose'
import Itinerary from '@/models/Itinerary'

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ItineraryType = await req.json()
    
    if (!body.prompt || !body.itinerary) {
      return new Response("Missing itinerary data", { status: 400 })
    }

    await connectToDatabase()

    const newItinerary = await Itinerary.create(body)

    return Response.json(
      { success: true, data: newItinerary },
      { status: 201 }
    )
  } catch (error) {
    const errorText = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Itinerary from '@/models/Itinerary'

type RequestBody = {
    isFavorite: boolean
}

export async function PUT(req: NextRequest, {params}: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    await connectToDatabase()

    const id = (await params).id
    const { isFavorite }: RequestBody = await req.json()
    
    if (typeof isFavorite !== "boolean") {
        return NextResponse.json({ error: 'isFavorite must be boolean' }, { status: 400 })
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        { isFavorite },
        { new: true }
    ).lean();

    if (!updatedItinerary) {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedItinerary })
  } catch (error) {
    const errorText = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}

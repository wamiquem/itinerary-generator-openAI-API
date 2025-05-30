import { NextRequest, NextResponse } from 'next/server'
import { OpenAIResponse } from '@/utils/interface'

type RequestBody = {
    message: string
}

export async function POST(req: NextRequest): Promise<Response> {
  const { message }: RequestBody = await req.json()

  try {
    // OpenAI Chat Completion API
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Open API key from .env.local
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]    // User prompt
        }),
    })

    if (!res.ok) {
        throw new Error('Failed to get response from OpenAI')
    }
    
    const data: OpenAIResponse = await res.json()
    return NextResponse.json(data)

  } catch (error) {
    const errorText = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}

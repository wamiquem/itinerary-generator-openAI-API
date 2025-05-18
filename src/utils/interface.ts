export interface OpenAIResponse {
    id: string
    object: 'chat.completion'
    created: number
    model: string
    choices: Array<{
      index: number
      message: {
        role: string
        content: string
      }
      finish_reason: string
    }>
}

export interface ItineraryType {
    prompt: string
    itinerary: string
    createdDate?: string
    isFavorite?: boolean
}

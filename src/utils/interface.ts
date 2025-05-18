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

export function isValidPrompt(prompt: string):boolean {
    const keywords: string[] = ['destination', 'travel', 'trip', 'itinerary', 'vacation']
    return keywords.some((keyword) => prompt.toLowerCase().includes(keyword))
}

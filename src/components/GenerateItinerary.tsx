'use client';

import { useCallback, useState } from "react"
import { Button, TextField, Typography, Box, Alert } from "@mui/material"
import { OpenAIResponse } from "@/utils/interface";
import { isValidPrompt } from "@/utils/validation";

const itineraryDefaultText: string = 'The generated itinerary will be displayed here.'

type generateAPIResponse = OpenAIResponse | { error: string }

export default function GenerateItinerary() {
    const [prompt, setPrompt] = useState<string>('')
    const [promptHelperText, setPromptHelperText] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>('')
    const [itineraryText, setItineraryText] = useState(itineraryDefaultText)

    const handleGenerateClick = useCallback(async (): Promise<void> => {
        if(!isValidPrompt(prompt)) {
          setPromptHelperText('Please enter only travel-related text. Include words like trip, travel, vacation etc.')
          return
        }
    
        setApiError('')
        setPromptHelperText('')
        setIsGenerating(true)
    
        try {
          const res: Response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }),
          })
    
          const data: generateAPIResponse = await res.json()
    
          if ('error' in data) {
            setApiError(data.error)
            return
          }
    
          const generatedItineraryText: string = data.choices[0].message.content
          setItineraryText(generatedItineraryText)
        } catch (error) {
          setApiError('Error connecting to server.')
        } finally {
          setIsGenerating(false);
        }
    }, [prompt])

    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>): void => {
          setPrompt(e.target.value)
    }, [])

    return (
        <>
            {apiError &&
                <Alert
                    variant="filled"
                    severity="error"
                    sx={{position: 'absolute', top: 5, zIndex: 9999}}
                >
                {apiError}
                </Alert>
            }
                
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 3,
                    borderRadius: 1,
                    width: '70%',
                    height: itineraryText === itineraryDefaultText ? '10%' : '60%',
                    margin: '0 auto',
                    overflowY: 'scroll',
                    transition: 'height 0.3s ease',
                    whiteSpace: 'pre-wrap'
                }}
            >
                <Typography
                    variant="body1"
                    align={itineraryText === itineraryDefaultText ? 'center' : 'left'}
                    color="text.primary"
                >
                    {itineraryText}
                </Typography>
            </Box>

            <TextField 
                multiline
                maxRows={4}
                placeholder="Enter a travel related text"
                variant="filled"
                sx={{
                    width: '70%',
                    position: 'relative'
                }}
                size="small"
                value={prompt}
                onChange={handlePromptChange}
                error={!!promptHelperText}
                helperText={promptHelperText}
                disabled={isGenerating}
            />

            <Box
                sx={{
                    display: 'flex',
                    gap: 10
                }}
            >
                <Button
                    variant="contained"
                    onClick={handleGenerateClick}
                    loading={isGenerating}
                    disabled={!prompt}
                >
                    Generate Itinerary
                </Button>

                <Button
                    variant="contained"
                    disabled={itineraryText === itineraryDefaultText}
                >
                    Save Itinerary
                </Button>
            </Box>
        </>
    )
}

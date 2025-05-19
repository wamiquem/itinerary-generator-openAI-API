'use client';

import { useCallback, useState } from "react"
import { 
    Button, TextField, Typography, Box, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material"
import { OpenAIResponse } from "@/utils/interface";
import { isValidPrompt } from "@/utils/validation";
import { ItineraryDocument } from "@/models/Itinerary";

const itineraryDefaultText: string = 'The generated itinerary will be displayed here'

type generateAPIResponse = OpenAIResponse | { error: string }
type saveAPIResponse = ItineraryDocument | { error: string }

export default function GenerateItinerary() {
    const [prompt, setPrompt] = useState<string>('')
    const [promptHelperText, setPromptHelperText] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>('')
    const [itineraryText, setItineraryText] = useState(itineraryDefaultText)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setPrompt(e.target.value)
    }, [])

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
        } catch (_) {
          setApiError('Error connecting to server.')
        } finally {
          setIsGenerating(false)
        }
    }, [prompt])

    const handleSaveClick = useCallback(async (): Promise<void> => {    
        setApiError('')
        setIsSaving(true)
    
        try {
          const res: Response = await fetch('/api/itineraries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, itinerary: itineraryText })
          })
    
          const data: saveAPIResponse = await res.json()
    
          if ('error' in data) {
            setApiError(data.error)
            return
          }

          setIsDialogOpen(true)
        } catch (_) {
          setApiError('Error connecting to server.')
        } finally {
          setIsSaving(false)
        }
    }, [prompt, itineraryText])

    const handleDialogClose = useCallback(() => {
        setIsDialogOpen(false)
        setPrompt('')
        setItineraryText(itineraryDefaultText)
    }, [])

    const isGenerated = itineraryText !== itineraryDefaultText

    return (
        <>                
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 3,
                    borderRadius: 1,
                    width: '70%',
                    height: isGenerated ? '60%' : '10%',
                    margin: '0 auto',
                    overflowY: 'scroll',
                    transition: 'height 0.3s ease',
                    whiteSpace: 'pre-wrap'
                }}
            >
                <Typography
                    variant="body1"
                    align={isGenerated ? 'left' : 'center'}
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
                    disabled={!prompt || isSaving}
                >
                    Generate Itinerary
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSaveClick}
                    disabled={!isGenerated || isGenerating}
                    loading={isSaving}
                >
                    Save Itinerary
                </Button>
            </Box>

            {apiError &&
                <Alert
                    severity="error"
                    onClose={() => setApiError('')}
                >
                {apiError}
                </Alert>
            }

            <Dialog open={isDialogOpen}>
                <DialogTitle>Success</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Itinerary saved successfully
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        color="primary"
                        variant="contained"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

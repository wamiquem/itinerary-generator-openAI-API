'use client';

import { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, Box, Checkbox, Container, Divider, FormControlLabel, TextField } from "@mui/material"
import { ItineraryDocument } from "@/models/Itinerary";
import Itinerary, { ItineraryProps } from "./Itinerary";

export default function History() {
    const [itineraries, setItineraries] = useState<ItineraryDocument[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>('')
    const [showFavorites, setShowFavorites] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')

    useEffect(() => {
      const getItineraries = async (): Promise<void> => {
        setApiError('')
        setIsFetching(true)

        try {
          const res: Response = await fetch("/api/history")
          const data: ItineraryDocument[] | { error: string } = await res.json()

          if ('error' in data) {
            setApiError(data.error)
            return
          }

          setItineraries(data)
        } catch {
          setApiError('Error connecting to server.')
        } finally {
          setIsFetching(false)
        }
      }
    
      getItineraries()
    }, [])

    const handleFavoriteChange = useCallback((id: string, isFavorite: boolean): void => {
      setItineraries((prev) => 
        prev.map((item) =>
          item._id === id ? ({ ...item, isFavorite } as ItineraryDocument) : item
        )
      )
    }, [])

    const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchQuery(e.target.value)
  }, [])

    const filteredItineraries: ItineraryDocument[] = useMemo(() => {
      // Filter first by matching search query
      const searchQueryMatchedItineraries =
        itineraries.filter((item) => 
          item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.itinerary.toLowerCase().includes(searchQuery.toLowerCase())
        )

      // Filter if Favorites checked else return all itineraries
      return showFavorites
        ? searchQueryMatchedItineraries.filter((item) => item.isFavorite)
        : searchQueryMatchedItineraries
    }, [showFavorites, itineraries, searchQuery])

    return (
      <>
        <Box sx={{
          position: 'fixed',
          top: '64px', // offset from top
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          p: 2,
          zIndex: 10,
          width: '70%',
          margin: 'auto',
        }}
        >
          <Box sx={{
            display: "flex",
            justifyContent: 'space-between'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showFavorites}
                  onChange={(): void => setShowFavorites(!showFavorites)}
                />}
              label="Show Favorites" 
            />

            <TextField
              placeholder="Search by prompt or answer..."
              type="search"
              variant="outlined"
              size="small"
              sx={{width: '50%'}}
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </Box>
          
          <Divider sx={{mt: 2}} />
        </Box>
        
        <Container sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          mt: 15
        }}
        >

          {apiError &&
            <Alert
                severity="error"
                onClose={() => setApiError('')}
            >
            {apiError}
            </Alert>
          }

          {isFetching && <Box>Fetching...</Box>}

          {
            filteredItineraries.map(item => {
              const props: ItineraryProps  = {
                id: item._id as string,
                prompt: item.prompt,
                itinerary: item.itinerary,
                isFavorite: item.isFavorite as boolean,
                createdDate: item.createdDate as string,
                onFavoriteChange: handleFavoriteChange
              }

              return <Itinerary {...props} key={item._id as string}/>
            })
          }
        </Container>
      </>
    )
}

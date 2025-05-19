'use client';

import { useCallback, useEffect, useState } from "react"
import { Alert, Box, Container } from "@mui/material"
import { ItineraryDocument } from "@/models/Itinerary";
import Itinerary, { ItineraryProps } from "./Itinerary";

export default function History() {
    const [itineraries, setItineraries] = useState<ItineraryDocument[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [apiError, setApiError] = useState<string>('')

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
        } catch (error) {
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

    return (
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        mt: 5
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
          itineraries.map(item => {
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
    )
}

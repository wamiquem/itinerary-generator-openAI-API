'use client';

import { useCallback, useState } from "react"
import { 
  Typography, Box, Card, CardContent, CardActions, IconButton, Modal, Tooltip, Alert
} from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'

export type ItineraryProps = {
  id: string
  prompt: string
  itinerary: string
  createdDate: string
  isFavorite: boolean
  onFavoriteChange: (id: string, isFavorite: boolean) => void
}

const modalContentStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height:'70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  overflowY: 'scroll',
  whiteSpace: 'pre-wrap'
}

export default function Itinerary({ id, prompt, itinerary, isFavorite, onFavoriteChange }: ItineraryProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string>('')

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleFavoriteClick = useCallback(async (): Promise<void> => {
    setApiError('')

    try {
      const res: Response = await fetch(`/api/itineraries/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      })

      const data: Response | { error: string } = await res.json()

      if ('error' in data) {
        setApiError(data.error)
        return
      }

      onFavoriteChange(id, !isFavorite)
    } catch {
      setApiError('Error connecting to server.')
    }
  }, [isFavorite, onFavoriteChange, id])

  return (
    <>
      <Card variant="outlined" sx={{ width: '70%', backgroundColor: '#f0f0f0' }}>
        <CardContent>
          <Typography variant="h6">{prompt}</Typography>
        </CardContent>

        <CardActions>
        <Tooltip 
          title={isFavorite ? "Unset Favorite" : "Set Favorite"}
          placement="top"
        >
          <IconButton onClick={handleFavoriteClick}>
            {isFavorite ? <FavoriteIcon color="primary"/> : <FavoriteOutlinedIcon color="primary"/>}
          </IconButton>
        </Tooltip>

          <Tooltip title="View Itinerary" placement="top">
            <IconButton onClick={() => setIsModalOpen(true)}>
              <VisibilityIcon color="primary"/>
            </IconButton>
          </Tooltip>
        </CardActions>

        {apiError &&
          <Alert
              severity="error"
              onClose={() => setApiError('')}
          >
          {apiError}
          </Alert>
        }
      </Card>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
      >
        <Box sx={modalContentStyle}>
          <Typography variant="h5">
            {prompt}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            {itinerary}
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

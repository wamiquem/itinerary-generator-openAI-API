import { Container, Typography } from "@mui/material"
import GenerateItinerary from "@/components/GenerateItinerary"

export default function Generate() {
  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
      height: '90vh'
    }}>
      <Typography
        variant="h4"
        align="center"
        sx={{width: '70%', mt: 1}}
      >
        Plan your perfect trip
      </Typography>

      <GenerateItinerary />
    </Container>
  )
}

import { AppBar, Box, Typography, Toolbar, Button } from "@mui/material"
import Link from 'next/link';

export default function Navbar() {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        display: 'flex',
                        fontWeight: 700,
                        flexGrow: 1
                    }}
            >
                Itinerary Generator
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/" passHref>
                <Button color="inherit">
                    Generate
                </Button>
            </Link>
            <Link href="/history" passHref>
                <Button color="inherit">
                    History
                </Button>
            </Link>
            </Box>
            </Toolbar>
        </AppBar>
    )
}

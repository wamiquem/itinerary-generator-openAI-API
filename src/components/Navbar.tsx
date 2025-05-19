import { AppBar, Box, Typography, Toolbar, Button, IconButton } from "@mui/material"
import Link from 'next/link'
import PublicIcon from '@mui/icons-material/Flight'

export default function Navbar() {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Link href="/" passHref>
                        <IconButton>
                            <PublicIcon sx={{ color: 'white' }}/>
                        </IconButton>
                    </Link>
                </Box>

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

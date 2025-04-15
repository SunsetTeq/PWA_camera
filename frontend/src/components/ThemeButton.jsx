import { IconButton, useColorScheme } from "@mui/material";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function SetTheme() {
    const {mode, setMode} = useColorScheme();
    if (!mode) return null;

    function test() {
        setMode(mode === 'dark'? 'light': 'dark')
    }
    

    return (
        <IconButton size='large' onClick={test}> <DarkModeOutlinedIcon fontSize='large' color="primary"/> </IconButton>
    )

}



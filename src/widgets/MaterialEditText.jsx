import { styled } from '@mui/material/styles';
import './../theme/colors.css'
import {TextField} from "@mui/material";

export const MaterialEditText = styled(TextField)(({ theme }) => ({
    '&': {
        width: "100%"
    },
    '& label': {
        color: 'var(--color-accent-900)',
    },
    '& label.Mui-focused': {
        color: 'var(--color-accent-900)',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'var(--color-accent-900)',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'var(--color-accent-900)',
            color: 'var(--color-accent-900)',
        },
    },
}));
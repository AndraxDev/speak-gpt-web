import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import './../theme/colors.css'

export const MaterialButton = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "12px",

    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
    },
}));

export const MaterialButton24 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "24px",
    paddingLeft: "12px",
    paddingRight: "12px",
    border: "1px solid var(--color-accent-800)",
    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));

export const MaterialButton16 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-50)",
    backgroundColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "16px",

    '&:hover': {
        backgroundColor: "var(--color-accent-900)",
    },
}));

export const MaterialButtonTonal = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-200)",
    textTransform: "none",
    boxShadow: "none",
    borderRadius: "12px",
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
        boxShadow: "none",
    },
}));

export const MaterialButtonCard = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    backgroundColor: "var(--color-accent-200)",
    borderRadius: "24px",
    textTransform: "none",
    width: "260px",
    height: "260px",
    '&:hover': {
        backgroundColor: "var(--color-accent-300)",
    },
}));

export const MaterialButtonError = styled(Button)(({ theme }) => ({
    color: "var(--color-warn)",
    backgroundColor: "var(--color-warn-transparent)",
    textTransform: "none",
    '&:hover': {
        backgroundColor: "var(--color-warn-transparent)",
    },
}));

export const MaterialButtonErrorCard = styled(Button)(({ theme }) => ({
    color: "var(--color-warn)",
    backgroundColor: "var(--color-warn-transparent)",
    borderRadius: "24px",
    width: "260px",
    height: "260px",
    textTransform: "none",
    '&:hover': {
        backgroundColor: "var(--color-warn-transparent)",
    },
}));

export const MaterialButtonOutlined = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    borderColor: "var(--color-accent-800)",
    textTransform: "none",
    border: "1px solid var(--color-accent-800)",
    paddingLeft: "12px",
    paddingRight: "12px",
    '&:hover': {
        backgroundColor: "var(--color-primary-accent-transparent)",
        borderColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));

export const MaterialButtonOutlined24 = styled(Button)(({ theme }) => ({
    color: "var(--color-accent-800)",
    borderColor: "var(--color-accent-800)",
    textTransform: "none",
    borderRadius: "24px",
    border: "1px solid var(--color-accent-800)",
    paddingLeft: "12px",
    paddingRight: "12px",
    '&:hover': {
        backgroundColor: "var(--color-primary-accent-transparent)",
        borderColor: "var(--color-accent-900)",
        border: "1px solid var(--color-accent-900)",
    },
}));
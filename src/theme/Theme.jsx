export const BaseTheme = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#3786ff',
        },
        secondary: {
            main: '#00ffff',
        },
        error: {
            main: '#db4437',
        },
        warning: {
            main: '#ff3d00',
        },
        success: {
            main: '#2e8b57',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50pc',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    minWidth: 320,
                },

            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    overflowWrap: "anywhere",
                    userSelect: "text",
                },
            },
        }
    },
}

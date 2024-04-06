import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import BaseRoutes from "./BaseRoutes";
import {createTheme, ThemeProvider} from "@mui/material";
import {BaseTheme} from "./Theme";

function App() {
    const baseTheme = createTheme(BaseTheme);

    return (
        <ThemeProvider theme={baseTheme}>
            <Router>
                <BaseRoutes/>
            </Router>
        </ThemeProvider>
    );
}

export default App;

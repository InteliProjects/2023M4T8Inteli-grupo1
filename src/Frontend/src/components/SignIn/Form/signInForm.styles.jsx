import styled from 'styled-components';
import { Container, Box, Button, Link , TextField} from '@mui/material';

export const StyledContainer = styled(Container)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw; 
    position: fixed;
    
`;

export const StyledBox = styled(Box)`
    margin: auto; 
    width: fit-content;
    width: 800px;   
    /* margin-left : -1rem;  */
    height: auto; 
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    position: relative;
    top: 22%;
    z-index: 2
`;

export const StyledButton = styled(Button)`
    margin-top: 1.5rem !important;
    margin-bottom: 1rem !important;
    background-color: #7E409C !important;

    &:hover {
        background-color: darken(#7E409C, 10%) !important;
    }
`;

export const StyledLink = styled(Link)`
    color: #7E409C !important;
    &:hover {
        color: darken(#7E409C, 10%) !important;
    }
    text-decoration: none !important;
`;


export const StyledTextField = styled(TextField)`
    & label.Mui-focused {
        color: #7E409C; 
    }
    & .MuiOutlinedInput-root {
        &.Mui-focused fieldset {
            border-color: #7E409C; 
        }
    }
`;
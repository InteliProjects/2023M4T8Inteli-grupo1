import React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { StyledContainer, StyledBox, StyledButton, StyledLink, StyledTextField } from './signInForm.styles';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom'; 
import Logo from '@assets/Logo.png';
import './signInForm.css'
import { userLogin } from '../../../store/actions/actionAuthentications';
import { useDispatch, useSelector } from 'react-redux';

const SignInForm = () => {
    const isLogged = useSelector((state) => state.auth.isLogged);

    const [credentials, setCredentials] = useState({
        email: '',
        senha: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginError = useSelector((state) => state.auth.error);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = (event) => {
        event.preventDefault();
        navigate('/user/forgotPassword');
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        navigate('/user/signUp');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(userLogin(credentials));
    };

    return (
        <StyledContainer>
            <StyledBox>
                <img src={Logo} alt="Logo" style={{ maxWidth: '250px', marginBottom: '5px' }} />
                <Typography style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                    Conectando Pessoas, Coisas e Possibilidades.
                </Typography>
                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <StyledTextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-mail"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={credentials.email}
                        onChange={handleChange}
                    />
                    <StyledTextField
                        margin="normal"
                        required
                        fullWidth
                        name="senha"
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        id="senha"
                        autoComplete="current-password"
                        value={credentials.senha}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <StyledButton type="submit" fullWidth variant="contained">
                        Login
                    </StyledButton>
                    {!isLogged && loginError && loginError.error && (
                    <Typography style={{ marginTop: '5px', marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                        {loginError.error}
                    </Typography>
                    )}
                    <Grid container>
                        <Grid item xs>
                            <StyledLink href="" variant="body2" onClick={handleForgotPassword}>
                               
                            </StyledLink>
                        </Grid>
                        <Grid item>
                            <StyledLink href="" variant="body2" onClick={handleSignUp}>
                                Não possui uma conta? Cadastra-se
                            </StyledLink>
                        </Grid>
                    </Grid>
                </Box>
            </StyledBox>
            <div className="circle-container">
                <div className="circle circle-large"></div>
                <div className="circle circle-medium"></div>
                <div className="circle circle-small"></div>
            </div>
        </StyledContainer>
    );
}

export default SignInForm;



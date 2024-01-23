import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if you are using react-router
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch if you are using Redux
import { Typography, Grid, Box, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '@assets/Logo.png'; // Ensure this path is correct
import { StyledContainer, StyledBox, StyledButton, StyledLink, StyledTextField } from './signUpForm.styles';
import './signUpForm.css';
import { userRegister } from '../../../store/actions/actionAuthentications';



const SignUpForm = () => {
    const isRegistered = useSelector((state) => state.auth.status);
    

    const [credentials, setCredentials] = useState({
        email: '',
        senha: '',
        confirmSenha: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setpasswordError] = useState('');
    const registerError = useSelector((state) => state.auth.error);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = (event) => {
        event.preventDefault();
        navigate('../signIn');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (credentials.senha !== credentials.confirmSenha) {
            setpasswordError('Passwords do not match'); 
            return;
        }
        const { email, senha } = credentials;
        dispatch(userRegister({ email, senha }));
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
                        label="Email"
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
                    <StyledTextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmSenha"
                        label="Confirme sua senha"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmSenha"
                        autoComplete="current-password"
                        value={credentials.confirmSenha}
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
                        Cadastra-se
                    </StyledButton>
                    {passwordError && (
                        <Typography color="error" style={{ marginTop: '5px', marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                            {passwordError}
                        </Typography>
                    )}
                    {registerError && registerError.error && (
                        <Typography style={{ marginTop: '5px', marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                            {registerError.error}
                        </Typography>
                    )}
                    <Grid container>
                        <Grid item>
                            <StyledLink href="" variant="body2" onClick={handleSignIn}>
                                Já possui uma conta? Clique Aqui
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

export default SignUpForm;



import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Grid, TextField, IconButton, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import { useTitle } from '../../../context/TitleContext';
import { addProduct } from "../../../store/actions/actionProduct";
import { useNavigate } from 'react-router-dom';

export const NewProduct = () => {
    const dispatch = useDispatch();
    const { setTitle } = useTitle();
    const templateProduct = useSelector((state) => state.product.products[0]);
    const [newProduct, setNewProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setTitle('Dashboard -> Produtos -> New');
        if (templateProduct) {
            const template = Object.keys(templateProduct).reduce((acc, key) => {
                if (key !== '_id') {
                    acc[key] = '';
                }
                return acc;
            }, {});
            setNewProduct(template);
        }
    }, [setTitle, templateProduct]);

    const handleChange = (prop) => (event) => {
        setNewProduct({ ...newProduct, [prop]: event.target.value });
    };

    const handleSave = () => {
        dispatch(addProduct(newProduct))
            // .unwrap()
            .then(() => {
                alert('Product has been saved successfully');
                navigate('/dash/');
            })
            .catch((error) => {
            });
    };

    const handleClear = () => {
        setNewProduct({});
    };
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    {Object.keys(newProduct).map((key) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <TextField
                                label={key.replace(/_/g, ' ')}
                                value={newProduct[key]}
                                onChange={handleChange(key)}
                                fullWidth
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton aria-label="clear" onClick={handleClear}>
                            <ClearIcon color="secondary" />
                        </IconButton>
                        <IconButton aria-label="save" onClick={handleSave}>
                            <SaveIcon color="primary" />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Button, Grid, TextField, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTitle } from '../../../context/TitleContext';
import Map from '../../Map';
// import Map from '../../Map';

export const DetailProducts = () => {
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);
    const product = products.find(p => p._id === id);
    const { setTitle } = useTitle();
    const [editData, setEditData] = useState({ ...product });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTitle('Lista de Ativos -> Detalhes');
        setEditData({ ...product });
    }, [setTitle, product]);

    if (!product) return <div>Loading...</div>;

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ ...product });
    };

    const handleChange = (prop) => (event) => {
        setEditData({ ...editData, [prop]: event.target.value });
    };
    const renderField = (fieldLabel, fieldName) => {
        return (
            <Grid item xs={12} sm={6} key={fieldName}>
                <Typography variant="body1" component="div">
                    <strong>{fieldLabel}:</strong>
                    {isEditing ? (
                        <TextField
                            value={editData[fieldName]}
                            onChange={handleChange(fieldName)}
                            margin="none"
                            InputProps={{
                                disableUnderline: true,
                                style: { fontSize: 'inherit' }
                            }}
                            fullWidth
                        />
                    ) : (
                        ` ${product[fieldName]}`
                    )}
                </Typography>
            </Grid>
        );
    };
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h5" component="h2">
                                {product.board_full_name}
                            </Typography>
                            {isEditing ? (
                                <>
                                    <IconButton aria-label="save" onClick={handleSave}>
                                        <CheckIcon color="primary" />
                                    </IconButton>
                                    <IconButton aria-label="cancel" onClick={handleCancel}>
                                        <CloseIcon color="secondary" />
                                    </IconButton>
                                </>
                            ) : (
                                <IconButton aria-label="edit" onClick={handleEditToggle}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Grid>
                        <Divider style={{ width: '100%', margin: '20px 0' }} />
                        {Object.keys(product).map((key) => {
                            return renderField(key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), key);
                        })}
                    </Grid>
                </CardContent>
            </Card>
            <Map />
            </>
    );
};
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Select, MenuItem, InputLabel, FormControl, Fade, Slide } from '@mui/material';

const Secreg = () => {
    const [gstin, setGstin] = useState('');
    const [orgName, setOrgName] = useState('');
    const [industry, setIndustry] = useState('');
    const [address, setAddress] = useState('');
    const [revenue, setRevenue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/secreg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gstin,
                    orgName,
                    industry,
                    address,
                    revenue
                })
            });

            const data = await response.json();
            console.log(data); 
        } catch (error) {
            console.error('Error in secreg:', error);
        }
    };

    return (
        <Container
            maxWidth="false"
            disableGutters
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #8E44AD, #3498DB)',
                width: '100%',
                px: 2,
            }}
        >
            <Fade in={true} timeout={1000}>
                <Paper
                    elevation={6}
                    sx={{
                        padding: 5,
                        borderRadius: 4,
                        width: '100%',
                        maxWidth: '700px',
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.3)',
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{ mb: 4, color: '#2C3E50', fontWeight: 'bold', letterSpacing: '0.5px' }}
                    >
                        Register Your Organization
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    variant="outlined"
                                    value={gstin}
                                    onChange={(e) => setGstin(e.target.value)}
                                    placeholder="Enter your GSTIN"
                                    sx={{ 
                                        transition: 'all 0.3s ease',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#8E44AD',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3498DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3498DB',
                                                boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Organization Name"
                                    variant="outlined"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Enter organization name"
                                    sx={{ 
                                        transition: 'all 0.3s ease',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#8E44AD',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3498DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3498DB',
                                                boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Industry"
                                    variant="outlined"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder="Enter industry type"
                                    sx={{ 
                                        transition: 'all 0.3s ease',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#8E44AD',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3498DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3498DB',
                                                boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box mb={3}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                    sx={{ 
                                        transition: 'all 0.3s ease',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#8E44AD',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3498DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3498DB',
                                                boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
                                            },
                                        }
                                    }}
                                />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                            <Box mb={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="revenue-label">Revenue</InputLabel>
                                    <Select
                                        labelId="revenue-label"
                                        value={revenue}
                                        onChange={(e) => setRevenue(e.target.value)}
                                        label="Revenue"
                                        sx={{ 
                                            transition: 'all 0.3s ease',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#8E44AD',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#3498DB',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3498DB',
                                                    boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)',
                                                },
                                            }
                                        }}
                                    >
                                        <MenuItem value="<20LPA">Less than 20 LPA</MenuItem>
                                        <MenuItem value=">20LPA">More than 20 LPA</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Slide>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                backgroundColor: '#3498DB',
                                transition: 'background-color 0.3s ease, transform 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#2980B9',
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Register
                        </Button>
                    </form>
                </Paper>
            </Fade>
        </Container>
    );
};

export default Secreg;

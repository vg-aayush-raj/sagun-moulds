import { Box, Container, Typography, Button, Card, CardContent, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BgImage from '../../assets/bg-cups.png';

// Updated contact data to match the image
const contacts = [
  {
    name: 'Chandan Kumar',
    role: 'Managing Director',
    phone: '+91 9876543210',
  },
  {
    name: 'Kiran Patel',
    role: 'Managing Director',
    phone: '+91 9123456780',
  },
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#1a2e44',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 15 },
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Overlay */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundImage: `url(${BgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.2, // Adjust transparency here
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(26, 46, 68, 0.5)', // Add a semi-transparent overlay to enhance readability
            },
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              fontWeight={700}
              align="center"
              sx={{
                mb: 1,
                letterSpacing: '0.05em',
              }}
            >
              SAGUN MOULDIFY
            </Typography>

            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                fontWeight: 400,
                letterSpacing: '0.1em',
                mb: 4,
                opacity: 0.8,
              }}
            >
              PRIVATE LIMITED
            </Typography>

            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h2"
              align="center"
              sx={{
                fontWeight: 600,
                mb: 6,
                letterSpacing: '0.05em',
              }}
            >
              MASTERED IN HIPS
              <br />
              THERMOFORMING CUPS
            </Typography>

            <Box display="flex" justifyContent="center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: '#1a2e44',
                    borderRadius: '4px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  CONTACT US
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ backgroundColor: '#f5f5f7', py: 5 }}>
        <Container maxWidth="md">
          <Typography
            variant="h6"
            component="h3"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: '#333',
            }}
          >
            POINT OF CONTACT
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {contacts.map((contact, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card
                    elevation={1}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'white',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h6" component="div" fontWeight={600} color="#333" sx={{ mb: 1 }}>
                        {contact.name}
                      </Typography>

                      <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                        {contact.role}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#555',
                          fontSize: '0.9rem',
                        }}
                      >
                        {contact.phone}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          bgcolor: '#1a2e44',
          mt: 'auto',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.8rem',
        }}
      >
        <Typography variant="body2">© 2024 SAGUN MOULDIFY PRIVATE LIMITED</Typography>
      </Box>
    </Box>
  );
}

import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Container, Typography, Button, Card, CardContent, Grid, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import BgImage from '../../assets/bg-cups.png';

// Updated contact data to match the image
const contacts = [
  {
    name: 'Chandan Kumar',
    role: 'Managing Director',
    phone: '+91 9876543210',
  },
  {
    name: 'Madhusudan Prasad',
    role: 'Managing Director',
    phone: '+91 9123456780',
  },
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              SAGUN MOLDIFY
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
            {contacts.map((contact, index) => {
              const gridProps: any = { item: true, xs: 12, md: 6, key: index };
              return (
                <Grid {...gridProps}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card elevation={5} sx={{ borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                      <CardContent>
                        <Typography variant="h6" component="div" fontWeight={600} color="text.primary">
                          {contact.name}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 1 }}>
                          {contact.role}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} color="primary.main">
                          <PhoneIcon fontSize="small" />
                          <Typography>{contact.phone}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
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
        <Typography variant="body2">
          © {new Date().getFullYear()} Sagun Moldify Pvt. Ltd. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

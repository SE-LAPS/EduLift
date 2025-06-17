import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const { mode } = useThemeContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | EduLift</title>
        <meta name="description" content="Get in touch with the EduLift team for inquiries, support, or feedback. We're here to help with all your educational needs." />
      </Head>
      
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          py: 8,
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box className="bg-blob bg-blob-1" />
        <Box className="bg-blob bg-blob-2" />
        
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={7} data-aos="fade-right">
              <Card className="hover-lift" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Send Us a Message
                  </Typography>
                  
                  {submitSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Your message has been sent successfully! We'll get back to you soon.
                    </Alert>
                  )}
                  
                  {submitError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {submitError}
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="100">
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="200">
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="300">
                        <TextField
                          fullWidth
                          label="Phone Number (Optional)"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="400">
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          error={!!errors.subject}
                          helperText={errors.subject}
                        />
                      </Grid>
                      
                      <Grid item xs={12} data-aos="fade-up" data-aos-delay="500">
                        <TextField
                          fullWidth
                          label="Your Message"
                          name="message"
                          multiline
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                                <MessageIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} data-aos="fade-up" data-aos-delay="600">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={isSubmitting}
                          sx={{ 
                            py: 1.5, 
                            px: 4, 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem'
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <CircularProgress size={24} sx={{ mr: 1 }} />
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={5} data-aos="fade-left">
              <Card className="hover-lift" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Contact Information
                  </Typography>
                  
                  <Typography variant="body1" paragraph color="text.secondary">
                    Feel free to reach out to us using any of the contact methods below. We're here to help!
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', mb: 3 }} data-aos="fade-up" data-aos-delay="100">
                      <LocationOnIcon color="primary" sx={{ fontSize: 28, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Our Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          NSBM Green University<br />
                          Pitipana - Thalagala Rd, Homagama<br />
                          Sri Lanka
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 3 }} data-aos="fade-up" data-aos-delay="200">
                      <PhoneInTalkIcon color="primary" sx={{ fontSize: 28, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Call Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          +94 11 544 5000<br />
                          Monday to Friday, 9am to 5pm
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 3 }} data-aos="fade-up" data-aos-delay="300">
                      <MailOutlineIcon color="primary" sx={{ fontSize: 28, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Email Us
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          info@edulift.com<br />
                          support@edulift.com
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 3 }} data-aos="fade-up" data-aos-delay="400">
                      <AccessTimeIcon color="primary" sx={{ fontSize: 28, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Office Hours
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monday to Friday: 9am - 5pm<br />
                          Saturday: 10am - 2pm<br />
                          Sunday: Closed
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom data-aos="fade-up" data-aos-delay="500">
                    Follow Us
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }} data-aos="fade-up" data-aos-delay="600">
                    <Button variant="outlined" sx={{ minWidth: 0, p: 1.2, borderRadius: 2 }}>
                      <Box component="img" src="/images/facebook-icon.svg" alt="Facebook" width={24} height={24} />
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: 0, p: 1.2, borderRadius: 2 }}>
                      <Box component="img" src="/images/twitter-icon.svg" alt="Twitter" width={24} height={24} />
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: 0, p: 1.2, borderRadius: 2 }}>
                      <Box component="img" src="/images/linkedin-icon.svg" alt="LinkedIn" width={24} height={24} />
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: 0, p: 1.2, borderRadius: 2 }}>
                      <Box component="img" src="/images/instagram-icon.svg" alt="Instagram" width={24} height={24} />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        
        {/* Full-width Map Section */}
        <Box 
          sx={{ 
            mt: 6,
            width: '100%',
            position: 'relative',
            height: { xs: '350px', md: '500px' },
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            marginBottom: '2px'
          }} 
          data-aos="fade-up" 
          data-aos-delay="700"
          className="hover-lift"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.575840369662!2d80.03899797455542!3d6.821334193176444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2523b05555555%3A0x546c34cd99f6f488!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1686564271561!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="EduLift Location at NSBM Green University"
          />
        </Box>
      </Box>
    </>
  );
};

export default Contact; 
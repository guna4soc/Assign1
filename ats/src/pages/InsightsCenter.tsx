import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Tooltip,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Review: React.FC = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState<string[]>([
    'Great service and timely delivery!',
    'The product quality was excellent.',
    'Customer support was very helpful.',
  ]);
  const [newReview, setNewReview] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const handleAddReview = () => {
    if (newReview.trim()) {
      if (editIndex !== null) {
        const updatedReviews = reviews.map((review, index) => (index === editIndex ? newReview : review));
        setReviews(updatedReviews);
        setEditIndex(null);
        setAlert({ open: true, message: 'Review updated successfully!', severity: 'success' });
      } else {
        setReviews([...reviews, newReview]);
        setAlert({ open: true, message: 'Review added successfully!', severity: 'success' });
      }
      setNewReview('');
    } else {
      setAlert({ open: true, message: 'Review cannot be empty.', severity: 'error' });
    }
  };

  const handleEditReview = (index: number) => {
    setNewReview(reviews[index]);
    setEditIndex(index);
  };

  const handleDeleteReview = (index: number) => {
    setReviewToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete !== null) {
      const updatedReviews = reviews.filter((_, index) => index !== reviewToDelete);
      setReviews(updatedReviews);
      setAlert({ open: true, message: 'Review deleted successfully!', severity: 'success' });
      setReviewToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
        py: 0,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        position: 'relative',
      }}
    >
      {/* Full-width header with reduced height */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, #232526 0%, #414345 100%)'
              : 'linear-gradient(90deg, #e3f2fd 0%, #b3e5fc 100%)', // light blue gradient
          color: '#1a237e', // deep blue for text
          textAlign: 'center',
          py: { xs: 2, sm: 3 },
          px: 0,
          boxShadow: '0 8px 32px 0 rgba(76, 110, 245, 0.10)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" letterSpacing={1} mb={0.5}>
          Insights Center
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          Share your experience and read what others say!
        </Typography>
      </Box>
      {/* Main content full width, centered, no sliding */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: { xs: 2, md: 4 },
          py: { xs: 2, sm: 4 },
          px: { xs: 0, sm: 2, md: 6 },
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: 600,
            mx: 'auto',
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            boxShadow: 3,
            mb: { xs: 2, md: 0 },
            background: theme.palette.mode === 'dark' ? '#232526' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
            transition: 'background 0.2s',
            overflowX: 'hidden',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Share Your Feedback
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Write your review here..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            sx={{ mb: 2, background: theme.palette.mode === 'dark' ? '#35363a' : '#f3f6fb', borderRadius: 2 }}
            InputProps={{ style: { color: theme.palette.mode === 'dark' ? '#fff' : undefined } }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddReview}
            sx={{
              borderRadius: 2,
              fontWeight: 'bold',
              boxShadow: '0 2px 8px 0 rgba(76, 110, 245, 0.10)',
              transition: 'background 0.2s',
              ':hover': {
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #414345 0%, #232526 100%)'
                    : 'linear-gradient(90deg, #48c6ef 0%, #6c63ff 100%)',
              },
            }}
          >
            {editIndex !== null ? 'Update Review' : 'Submit Review'}
          </Button>
        </Paper>
        <Paper
          elevation={4}
          sx={{
            flex: 2,
            minWidth: 0,
            maxWidth: 800,
            mx: 'auto',
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            boxShadow: 3,
            background: theme.palette.mode === 'dark' ? '#232526' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#222',
            transition: 'background 0.2s',
            overflowX: 'hidden',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="primary">
            Customer Reviews
          </Typography>
          <List>
            {reviews.map((review, index) => (
              <Fade in key={index} timeout={500 + index * 100}>
                <Box sx={{ overflowX: 'hidden' }}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      background: theme.palette.mode === 'dark' ? '#35363a' : '#f3f6fb',
                      color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                      boxShadow: '0 1px 4px 0 rgba(76, 110, 245, 0.05)',
                      transition: 'box-shadow 0.2s',
                      ':hover': {
                        boxShadow: '0 4px 16px 0 rgba(76, 110, 245, 0.10)',
                      },
                      overflowX: 'hidden',
                    }}
                    secondaryAction={
                      <Box>
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditReview(index)}
                            sx={{
                              color: '#6c63ff',
                              mr: 1,
                              transition: 'color 0.2s',
                              ':hover': { color: '#48c6ef' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteReview(index)}
                            sx={{
                              color: '#f44336',
                              transition: 'color 0.2s',
                              ':hover': { color: '#b71c1c' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={review}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                      }}
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider />}
                </Box>
              </Fade>
            ))}
          </List>
        </Paper>
      </Box>
      {/* Snackbar for alerts */}
      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteReview} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Review;

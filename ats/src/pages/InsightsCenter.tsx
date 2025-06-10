import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Review: React.FC = () => {
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
    <Box>
      <Box
        sx={{
          borderRadius: 2,
          p: 3,
          mb: 2,
          background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Review
        </Typography>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
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
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddReview}>
          {editIndex !== null ? 'Update Review' : 'Submit Review'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Customer Reviews
        </Typography>
        <List>
          {reviews.map((review, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditReview(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReview(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={review} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

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

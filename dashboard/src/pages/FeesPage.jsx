import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, LinearProgress, IconButton, Paper
} from '@mui/material';
import {
  Payment, Receipt, Warning, CheckCircle, CreditCard,
  History, Download, ArrowForward
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FeesPage() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null); // Fee object being paid
  const [paymentForm, setPaymentForm] = useState({ cardNo: '', cvv: '', expiry: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: 'success' });

  const fetchFees = async () => {
    try {
      const res = await api.get('/fees');
      setFees(res.data.fees);
    } catch (e) {
      console.error('Failed to fetch fees', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePayment = async () => {
    setPayLoading(true);
    setMsg({ text: '', type: 'success' });
    try {
      const res = await api.post(`/fees/${paying._id}/pay`, paymentForm);
      setMsg({ text: res.data.message, type: 'success' });
      setPaying(null);
      setPaymentForm({ cardNo: '', cvv: '', expiry: '' });
      fetchFees();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || 'Payment failed', type: 'error' });
    } finally {
      setPayLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Unpaid': return 'error';
      default: return 'warning';
    }
  };

  if (loading) return <LinearProgress />;

  const unpaidFees = fees.filter(f => f.status !== 'Paid');
  const totalDue = unpaidFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>Fee Management</Typography>
        <Typography variant="body1" color="text.secondary">View your pending dues and payment history</Typography>
      </Box>

      {msg.text && (
        <Alert severity={msg.type} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMsg({ text: '', type: 'success' })}>
          {msg.text}
        </Alert>
      )}

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Payment color="primary" />
                <Typography variant="h6" fontWeight={700}>Total Pending</Typography>
              </Box>
              <Typography variant="h3" fontWeight={800} color="primary">₹{totalDue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {unpaidFees.length} pending records found
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Next Due Date</Typography>
              {unpaidFees.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {new Date(unpaidFees[0].dueDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For {unpaidFees[0].title}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="h5" fontWeight={700}>No pending dues!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fee Table */}
      <Card>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>Fee Records</Typography>
          <Button startIcon={<History />} size="small">Payment History</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No fee records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fees.map((fee) => (
                  <TableRow key={fee._id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{fee.title}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {fee._id.slice(-8)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>₹{fee.amount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={fee.status}
                        size="small"
                        color={getStatusColor(fee.status)}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {fee.status === 'Paid' ? (
                        <Button
                          startIcon={<Receipt />}
                          variant="outlined"
                          size="small"
                          onClick={() => window.alert(`Receipt #${fee.receiptNumber}\nTransaction: ${fee.paymentDetails.transactionId}`)}
                        >
                          Receipt
                        </Button>
                      ) : user?.role === 'Student' ? (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CreditCard />}
                          onClick={() => setPaying(fee)}
                        >
                          Pay Now
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Awaiting Student Action</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={!!paying} onClose={() => !payLoading && setPaying(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <CreditCard sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={800}>Fee Payment</Typography>
          <Typography variant="body2" color="text.secondary">
            Paying for: {paying?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Amount Due:</Typography>
              <Typography variant="body2" fontWeight={700}>₹{paying?.amount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Processing Fee:</Typography>
              <Typography variant="body2" fontWeight={700}>₹0.00</Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="4111 1111 1111 1111"
                value={paymentForm.cardNo}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardNo: e.target.value })}
                disabled={payLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry (MM/YY)"
                placeholder="12/27"
                value={paymentForm.expiry}
                onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                disabled={payLoading}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                type="password"
                placeholder="123"
                value={paymentForm.cvv}
                onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                disabled={payLoading}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="caption">Secure SSL encrypted payment</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPaying(null)} disabled={payLoading}>Cancel</Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handlePayment}
            disabled={payLoading || !paymentForm.cardNo || !paymentForm.cvv || !paymentForm.expiry}
          >
            {payLoading ? 'Processing...' : `Pay ₹${paying?.amount.toLocaleString()}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card } from '@mui/material';

export default function SkeletonTable({ columns = 5, rows = 6 }) {
  return (
    <TableContainer component={Card}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i}><Skeleton variant="text" width={80} /></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <TableCell key={c}><Skeleton variant="text" width={60 + Math.random() * 60} sx={{ borderRadius: 1 }} /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

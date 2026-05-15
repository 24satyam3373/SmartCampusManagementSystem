import { Button } from '@mui/material';
import { FileDownload } from '@mui/icons-material';

export default function ExportButton({ data, filename = 'export', columns }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    const headers = columns || Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach((row) => {
      const values = headers.map((h) => {
        let val = row[h];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        // Escape commas and quotes
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outlined" size="small" startIcon={<FileDownload />} onClick={handleExport}
      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
      Export CSV
    </Button>
  );
}

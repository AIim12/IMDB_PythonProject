// Simple CSV file downloader
export const downloadCsv = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to download.');
    return;
  }

  const headers = Object.keys(data[0]);
  
  const escapeCsvCell = (cell) => {
    if (cell === null || cell === undefined) {
      return '';
    }
    const str = String(cell);
    // If the cell contains a comma, double quote, or newline, wrap it in double quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      // Escape existing double quotes by doubling them
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => escapeCsvCell(row[header])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  URL.revokeObjectURL(url);
};
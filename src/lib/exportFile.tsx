import * as XLSX from "xlsx";

const exportFile = async (rows: any[], fileName: string) => {
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(rows);

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, fileName);

  // Save the workbook as a file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export default exportFile;

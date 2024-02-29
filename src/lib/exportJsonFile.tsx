const exportJsonFile = async (rows: any[]) => {
  try {
    rows.forEach((row) => {
      const jsonContent = JSON.stringify(row, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const filename = `${row.name}.json`;
      downloadBlob(blob, filename);
    });
  } catch (error) {
    console.error("Error exporting JSON files:", error);
  }
};

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(link.href);
};

export default exportJsonFile;

import moment from "moment";

const archiveRow = async (rows: any[], url: string) => {
  if (rows.length === 0) {
    console.error("Please select at least one row to clone.");
    return;
  }

  try {
    // Extract the IDs of the selected rows
    const ids = rows.map((row) => row._id);

    // Send a POST request to the API endpoint
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids,
        status: "Archived",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to archive rows.");
    }
    return response.ok;
  } catch (error) {
    console.error("Error archiving rows:", error);
    return null;
  }
};

export default archiveRow;

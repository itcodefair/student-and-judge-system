import moment from "moment";

const addRow = async (rows: any[], url: string) => {
  if (rows.length === 0) {
    console.error("Please select at least one row to clone.");
    return;
  }

  try {
    const body = rows.map(({ _id, ...row }) => {
      const newRow = { ...row };
      for (const key in newRow) {
        if (key.endsWith("Date")) {
          newRow[key] = moment(newRow[key]).format();
        }
      }
      newRow.createdDate = moment().format();
      newRow.updatedDate = moment().format();
      return newRow;
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to clone rows.");
    }
    return response.ok;
  } catch (error) {
    console.error("Error cloning rows:", error);
    return null;
  }
};

export default addRow;

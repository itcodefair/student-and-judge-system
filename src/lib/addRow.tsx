import moment from "moment";

const addRow = async (data: {}, url: string) => {
  try {
    const formattedData = { ...data };
    for (const key in formattedData) {
      if (key.endsWith("Date")) {
        formattedData[key] = moment(formattedData[key]).format();
      }
    }

    const body = [
      {
        ...formattedData,
        createdDate: moment().format(),
        updatedDate: moment().format(),
      },
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to add row.");
    }
    return response.ok;
  } catch (error) {
    console.error("Error adding row:", error);
    return null;
  }
};

export default addRow;

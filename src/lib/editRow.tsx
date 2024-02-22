export default async function editRow(rowData: any, url: string) {
  try {
    const { _id, ...values } = rowData;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: _id,
        ...values,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to edit row.");
    }
    return response.ok;
  } catch (error) {
    console.error("Error editing row:", error);
    return null;
  }
}

const deleteToken = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_FRONT_END_KEY + "/user",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete token");
    }

    const data = await response.json();
    // console.log(data); // Logging the response from server
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};
export default deleteToken
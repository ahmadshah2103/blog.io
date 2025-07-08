/**
 * Retrieves and parses the user data from localStorage.
 * Throws an error if the data is missing or invalid.
 */
export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    throw new Error("No user found in localStorage.");
  }
  try {
    const parsedUser = JSON.parse(user);
    if (!parsedUser.id) {
      throw new Error("User data is missing id.");
    }
    return parsedUser;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    throw new Error("Failed to retrieve user data.");
  }
};

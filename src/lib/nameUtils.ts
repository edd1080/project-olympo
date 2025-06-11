
/**
 * Extracts the first name and first last name from a full name string
 * @param fullName - The complete name string
 * @returns A string with "FirstName FirstLastName" format
 */
export const getFirstNameAndLastName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 0) {
    return '';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // Return first name and first last name
  return `${nameParts[0]} ${nameParts[1]}`;
};

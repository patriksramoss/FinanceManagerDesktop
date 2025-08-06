export const handleApiError = (error: unknown, context = "") => {
  console.error(`❌ ${context}`, error);
};

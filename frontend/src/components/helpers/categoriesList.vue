 const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    categoriesList.value = await GetCategoriesByType("events");
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories. Please try again.";
  } finally {
    isLoading.value = false;
  }
};




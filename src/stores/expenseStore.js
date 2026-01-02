import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useExpenseStore = defineStore("expenseStore", () => {
  const combinedList = ref([]);

  // Helper function to generate unique ID
  const generateUniqueId = () => {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  };

  // Helper function to extract categories from transactions
  const extractCategories = (type) => {
    const categories = new Set();
    combinedList.value
      .filter((item) => item.type === type)
      .forEach((item) => {
          if (item.selectedCategory) {
            categories.add(item.selectedCategory);
        }
      });
    return Array.from(categories);
  };

  // Helper function to calculate category amounts
  const calculateCategoryAmounts = (type) => {
    const categories = extractCategories(type);
    const categoryAmounts = new Map();

    // Initialize all categories with 0
    categories.forEach((cat) => categoryAmounts.set(cat, 0));

    // Sum amounts by category
    combinedList.value
      .filter((item) => item.type === type)
      .forEach((item) => {
          if (item.selectedCategory) {
            const currentAmount = categoryAmounts.get(item.selectedCategory) || 0;
            categoryAmounts.set(item.selectedCategory, currentAmount + Number(item.amount));
        }
      });

    return Array.from(categoryAmounts.values());
  };

  // Computed properties - optimized to reduce iterations
  const incomeList = computed(() => combinedList.value.filter((item) => item.type === "income"));

  const expenseList = computed(() => combinedList.value.filter((item) => item.type === "expense"));

  const totalIncome = computed(() =>
    incomeList.value.reduce((sum, item) => sum + Number(item.amount), 0),
  );

  const totalExpense = computed(() =>
    expenseList.value.reduce((sum, item) => sum + Number(item.amount), 0),
  );

  const netBalance = computed(() => totalIncome.value - totalExpense.value);

  const expenseCategories = computed(() => extractCategories("expense"));

  const incomeCategories = computed(() => extractCategories("income"));

  const expenseAmountsByCategory = computed(() => calculateCategoryAmounts("expense"));

  const incomeAmountsByCategory = computed(() => calculateCategoryAmounts("income"));

  // Actions
  const addItem = (data, type) => {
    const currentTimestamp = data.date || Date.now();
    const uniqueId = generateUniqueId();

    const newTransaction = {
      id: uniqueId,
      type,
      date: currentTimestamp,
      amount: Number(data.amount),
      description: data.description || "",
      selectedCategory: data.selectedCategory || "",
    };

    combinedList.value.push(newTransaction);
  };

  const removeItem = (value, type) => {};

  const updateItem = (value, type) => {};

  return {
    incomeList,
    expenseList,
    combinedList,
    totalIncome,
    totalExpense,
    netBalance,
    expenseCategories,
    incomeCategories,
    incomeAmountsByCategory,
    expenseAmountsByCategory,
    addItem,
    removeItem,
    updateItem,
  };
});

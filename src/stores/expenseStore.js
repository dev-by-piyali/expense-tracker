import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useExpenseStore = defineStore("expenseStore", () => {
  const currentMonth = ref(new Date().getMonth() + 1);
  const combinedList = ref([]);

  const MONTHS = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  //Helper function to set current month
  const setCurrentMonth = (month) => {
    currentMonth.value = month;
  };

  // Helper function to generate unique ID
  const generateUniqueId = () => {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  };

  // Helper function to extract categories from transactions
  const extractCategories = (type) => {
    const categories = new Set();
    groupByMonthData.value[currentMonth.value]?.length &&
      groupByMonthData.value[currentMonth.value]
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
    groupByMonthData.value[currentMonth.value]?.length &&
      groupByMonthData.value[currentMonth.value]
        .filter((item) => item.type === type)
        .forEach((item) => {
          if (item.selectedCategory) {
            const currentAmount = categoryAmounts.get(item.selectedCategory) || 0;
            categoryAmounts.set(item.selectedCategory, currentAmount + Number(item.amount));
          }
        });

    return Array.from(categoryAmounts.values());
  };

  // Computed properties
  const incomeList = computed(
    () =>
      groupByMonthData.value[currentMonth.value]?.filter((item) => item.type === "income") || [],
  );

  const expenseList = computed(
    () =>
      groupByMonthData.value[currentMonth.value]?.filter((item) => item.type === "expense") || [],
  );

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

  const groupByMonthData = computed(() => {
    return combinedList.value.reduce((acc, item) => {
      const month = item.month;

      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(item);
      return acc;
    }, {});
  });

  const groupByMonthTotal = computed(() => {
    const totals = {}; //{ monthKey: { income: number, expense: number } }
    Object.keys(MONTHS).forEach((monthKey) => {
      const monthData = groupByMonthData.value[monthKey] || [];
      const incomeTotal = monthData
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + Number(item.amount), 0);
      const expenseTotal = monthData
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + Number(item.amount), 0);
      totals[monthKey] = { income: incomeTotal, expense: expenseTotal };
    });
    return totals;
  });

  // Actions
  const addItem = (data, type) => {
    const month = currentMonth.value || new Date().getMonth() + 1;
    const uniqueId = generateUniqueId();

    const newTransaction = {
      id: uniqueId,
      type,
      month: month,
      amount: Number(data.amount),
      description: data.description || "",
      selectedCategory: data.selectedCategory || "",
    };

    combinedList.value.push(newTransaction);
  };

  const removeItem = (value, type) => {};

  const updateItem = (value, type) => {};

  return {
    MONTHS,
    incomeList,
    expenseList,
    combinedList,
    currentMonth,
    totalIncome,
    totalExpense,
    netBalance,
    expenseCategories,
    incomeCategories,
    incomeAmountsByCategory,
    expenseAmountsByCategory,
    groupByMonthData,
    groupByMonthTotal,
    addItem,
    removeItem,
    updateItem,
    setCurrentMonth,
  };
});

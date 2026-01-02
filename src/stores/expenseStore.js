import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useExpenseStore = defineStore("expenseStore", () => {
  const incomeList = ref([]);
  const expenseList = ref([]);
  const combinedList = ref([]);

  const totalIncome = computed(() =>
    combinedList.value
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0),
  );

  const totalExpense = computed(() =>
    combinedList.value
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0),
  );

  const netBalance = computed(() => totalIncome.value - totalExpense.value);

  const expenseCategories = computed(() => {
    const categories = new Set();
    combinedList.value
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        if (item.selectedCategories && Array.isArray(item.selectedCategories)) {
          item.selectedCategories.forEach((cat) => categories.add(cat));
        }
      });
    return Array.from(categories);
  });

  const incomeCategories = computed(() => {
    const categories = new Set();
    combinedList.value
      .filter((item) => item.type === "income")
      .forEach((item) => {
        if (item.selectedCategories && Array.isArray(item.selectedCategories)) {
          item.selectedCategories.forEach((cat) => categories.add(cat));
        }
      });
    return Array.from(categories);
  });

  const expenseAmountsByCategory = computed(() => {
    const categoryAmounts = {};
    expenseCategories.value.forEach((cat) => {
      categoryAmounts[cat] = 0;
    });
    combinedList.value
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        if (item.selectedCategories && Array.isArray(item.selectedCategories)) {
          item.selectedCategories.forEach((cat) => {
            categoryAmounts[cat] += Number(item.amount);
          });
        }
      });
    return Object.values(categoryAmounts);
  });

  const incomeAmountsByCategory = computed(() => {
    const categoryAmounts = {};
    incomeCategories.value.forEach((cat) => {
      categoryAmounts[cat] = 0;
    });
    combinedList.value
      .filter((item) => item.type === "income")
      .forEach((item) => {
        if (item.selectedCategories && Array.isArray(item.selectedCategories)) {
          item.selectedCategories.forEach((cat) => {
            categoryAmounts[cat] += Number(item.amount);
          });
        }
      });
    return Object.values(categoryAmounts);
  });

  const expenseCategoriesPalette = [
    "#f4a261",
    "#e76f51",
    "#2a9d8f",
    "#e9c46a",
    "#264653",
    "#8ab17d",
    "#d4a574",
    "#e8b4b8",
    "#a8dadc",
    "#457b9d",
    "#1d3557",
    "#f1faee",
    "#e4ac1dff",
  ];

  const addItem = (data, type) => {
    const generateRandomId = () => {
      return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    };

    const uniqueId = generateRandomId();

    if (type === "income") {
      incomeList.value.push({ id: incomeList.value.length + 1, uniqueId, ...data });
    }
    if (type === "expense") {
      expenseList.value.push({ id: expenseList.value.length + 1, uniqueId, ...data });
    }

    combinedList.value.push({ id: combinedList.value.length + 1, uniqueId, type, ...data });

    console.log("income", incomeList.value);
    console.log("expense", expenseList.value);
    console.log("combinedList", combinedList.value);
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
    expenseCategoriesPalette,
    addItem,
    removeItem,
    updateItem,
  };
});

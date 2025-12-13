import { defineStore } from "pinia";
import { ref } from "vue";

export const useExpenseStore = defineStore("expenseStore", () => {
  const incomeList = ref([]);
  const expenseList = ref([]);
  const combinedList = ref([]);

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
    addItem,
    removeItem,
    updateItem,
  };
});

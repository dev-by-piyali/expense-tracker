<script setup>
import { ref } from "vue";
import AddIncomeExpense from "@/components/AddIncomeExpense.vue";
import ExpenseHistory from "@/components/ExpenseHistory.vue";
import Dashboard from "@/components/Dashboard.vue";
import { useExpenseStore } from "@/stores/expenseStore";

const expenseStore = useExpenseStore();
const showDashboard = ref(false);

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

const handleMonthChange = (val) => {
  const monthKey = Object.keys(MONTHS).find((key) => MONTHS[key] === val);
  expenseStore.setCurrentMonth(monthKey);
};
</script>

<template>
  <header class="w-100 d-flex align-center justify-space-between pa-4">
    <h1 class="w-100">Expense Tracker</h1>
    <v-select
      :items="Object.values(MONTHS)"
      :model-value="MONTHS[expenseStore.currentMonth]"
      @update:model-value="handleMonthChange"
      density="compact"
      prepend-inner-icon="mdi-calendar"
      hide-details
      class="w-25 mx-2 month-chip"
    ></v-select>
    <v-icon
      class="insight cursor-pointer d-none d-md-block"
      icon="mdi-chart-areaspline"
      size="30"
      @click="showDashboard = !showDashboard"
    />
  </header>

  <main v-if="!showDashboard" class="main-section flex-grow-1 ga-4 mt-6">
    <AddIncomeExpense />
    <ExpenseHistory />
  </main>
  <main v-else class="flex-grow-1 ga-4 mt-6 w-100">
    <Dashboard />
  </main>
</template>

<style scoped lang="scss">
.main-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.insight {
  color: #5c7a63;
}

@media (max-width: 960px) {
  .main-section {
    grid-template: none;
  }
}
</style>

<script setup>
import AddIncomeExpense from "@/components/AddIncomeExpense.vue";
import ExpenseHistory from "@/components/ExpenseHistory.vue";
</script>

<template>
  <header>
    <h1>Expense Tracker</h1>
  </header>

  <main class="main-section flex-grow-1 ga-4 mt-6">
    <AddIncomeExpense />
    <ExpenseHistory />
  </main>
</template>

<style scoped lang="scss">
.main-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

@media (max-width: 960px) {
  .main-section {
    grid-template: none;
  }
}
</style>

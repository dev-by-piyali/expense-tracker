<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import Chart from "chart.js/auto";
import { useExpenseStore } from "@/stores/expenseStore";

// Store
const expenseStore = useExpenseStore();

// Chart refs
const expenseVsIncomeChartCanvas = ref(null);
const expenseChartCanvas = ref(null);
const incomeChartCanvas = ref(null);
const monthVsMonthChartCanvas = ref(null);

// Chart instances
let expenseVsIncomeChart = null;
let categoryChart = null;
let incomeChart = null;
let monthVsMonthChart = null;

const formatAmount = (amount) =>
  Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// Color Palette
const colors = {
  income: "#a8c4ae", // sage-light
  expense: "#e8a889", // terracotta-light
};

const expenseCategoriesPalette = [
  "#c4704b", // terracotta (anchor)
  "#7d9b84", // sage (anchor)
  "#b8860b", // dark goldenrod
  "#cd8c52", // copper
  "#8fbc8f", // dark sea green
  "#bc8f8f", // rosy brown
  "#daa06d", // camel
  "#a0785a", // chamoisee
  "#6b8e6b", // fern
  "#c9a66b", // desert sand
  "#9e7b6e", // cinereous
  "#f4a261", // orange
  "#d4a853", // gold
];

const incomeCategoriesPalette = [
  "#2a9d8f", // teal
  "#e8b4b8", // light pink
  "#e76f51", // coral
  "#d4a853", // gold
];

// Chart Configurations
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    title: {
      display: true,
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      callbacks: {
        title: function () {
          return null;
        },
        label: function (context) {
          let label = context.label?.split("-")[0] || "";
          if (context.raw !== null) {
            label += ` - ₹${formatAmount(context.raw)}`;
          }
          return label;
        },
      },
    },
  },
};

const expenseVsIncomeChartConfig = {
  type: "bar",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        backgroundColor: [colors.income, colors.expense],
        data: [expenseStore.totalIncome, expenseStore.totalExpense],
        borderWidth: 2,
        borderColor: "#fefdfb",
        hoverOffset: 8,
      },
    ],
  },
  options: {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        ...chartDefaults.plugins.title,
        text: `Income vs Expenses - ${expenseStore.MONTHS[expenseStore.currentMonth]}`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const expenseChartConfig = {
  type: "doughnut",
  data: {
    labels: expenseStore.expenseCategories.map((item, i) => {
      return `${item} - ₹${formatAmount(expenseStore.expenseAmountsByCategory?.[i] || 0)}`;
    }),
    datasets: [
      {
        backgroundColor: expenseCategoriesPalette,
        data: expenseStore.expenseAmountsByCategory,
        borderWidth: 2,
        borderColor: "#fefdfb",
        hoverOffset: 8,
      },
    ],
  },
  options: {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        ...chartDefaults.plugins.title,
        text: "Expenses by Category",
      },
      legend: {
        ...chartDefaults.plugins.legend,
        position: "right",
      },
    },
  },
};

const incomeChartConfig = {
  type: "doughnut",
  data: {
    labels: expenseStore.incomeCategories.map((item, i) => {
      return `${item} - ₹${formatAmount(expenseStore.incomeAmountsByCategory?.[i] || 0)}`;
    }),
    datasets: [
      {
        backgroundColor: incomeCategoriesPalette,
        data: expenseStore.incomeAmountsByCategory,
        borderWidth: 2,
        borderColor: "#fefdfb",
        hoverOffset: 8,
      },
    ],
  },
  options: {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        ...chartDefaults.plugins.title,
        text: "Income by Category",
      },
    },
  },
};

const monthVsMonthChartConfig = {
  type: "line",
  data: {
    labels: Object.values(expenseStore.MONTHS),
    datasets: [
      {
        label: "Income",
        borderColor: colors.income,
        backgroundColor: colors.income,
        data: Object.values(expenseStore.groupByMonthTotal)?.map((month) => month.income) || [
          2000, 2333, 2332,
        ],
        fill: false,
        tension: 0.4,
      },
      {
        label: "Expenses",
        borderColor: colors.expense,
        backgroundColor: colors.expense,
        data: Object.values(expenseStore.groupByMonthTotal)?.map((month) => month.expense) || [],
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        ...chartDefaults.plugins.title,
        text: "Monthly Trend - Income and Expenses",
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function () {
            return null;
          },
          label: function (context) {
            let label = context.dataset.label || "";
            if (context.raw !== null) {
              label += ` - ₹${formatAmount(context.raw)}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

// Lifecycle Hooks
onMounted(() => {
  if (expenseVsIncomeChartCanvas.value) {
    expenseVsIncomeChart = new Chart(expenseVsIncomeChartCanvas.value, expenseVsIncomeChartConfig);
  }

  if (expenseChartCanvas.value) {
    categoryChart = new Chart(expenseChartCanvas.value, expenseChartConfig);
  }

  if (incomeChartCanvas.value) {
    incomeChart = new Chart(incomeChartCanvas.value, incomeChartConfig);
  }

  if (monthVsMonthChartCanvas.value) {
    monthVsMonthChart = new Chart(monthVsMonthChartCanvas.value, monthVsMonthChartConfig);
  }
});

watch(
  () => [expenseStore.currentMonth],
  ([newMonth]) => {
    if (expenseVsIncomeChart) {
      expenseVsIncomeChart.data.datasets[0].data = [
        expenseStore.totalIncome,
        expenseStore.totalExpense,
      ];
      expenseVsIncomeChart.options.plugins.title.text = `Income vs Expenses - ${expenseStore.MONTHS[expenseStore.currentMonth]}`;
      expenseVsIncomeChart.update();
    }
    if (categoryChart) {
      categoryChart.data.labels = expenseStore.expenseCategories.map((item, i) => {
        return `${item} - ₹${formatAmount(expenseStore.expenseAmountsByCategory?.[i] || 0)}`;
      });
      categoryChart.data.datasets[0].data = expenseStore.expenseAmountsByCategory;
      categoryChart.update();
    }
    if (incomeChart) {
      incomeChart.data.labels = expenseStore.incomeCategories.map((item, i) => {
        return `${item} - ₹${formatAmount(expenseStore.incomeAmountsByCategory?.[i] || 0)}`;
      });
      incomeChart.data.datasets[0].data = expenseStore.incomeAmountsByCategory;
      incomeChart.update();
    }
  },
  { deep: true },
);

onUnmounted(() => {
  expenseVsIncomeChart?.destroy();
  categoryChart?.destroy();
  incomeChart?.destroy();
  monthVsMonthChart?.destroy();
});
</script>

<template>
  <div class="charts-container">
    <div class="chart-card">
      <canvas ref="incomeChartCanvas"></canvas>
    </div>

    <div class="chart-card">
      <canvas ref="expenseChartCanvas"></canvas>
    </div>

    <div class="chart-card">
      <canvas ref="expenseVsIncomeChartCanvas"></canvas>
    </div>

    <div class="chart-card">
      <canvas ref="monthVsMonthChartCanvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.charts-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
}

.chart-card {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 1rem;
  box-shadow:
    0 4px 24px var(--shadow-color, rgba(26, 25, 24, 0.08)),
    0 1px 4px var(--shadow-color, rgba(26, 25, 24, 0.04));
  border: 1px solid var(--color-border, rgba(26, 25, 24, 0.08));
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

canvas {
  max-height: 350px;
  min-height: 200px;
}
</style>

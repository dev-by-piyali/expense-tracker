<script setup>
import { computed } from "vue";
import { useExpenseStore } from "@/stores/expenseStore";

const expenseStore = useExpenseStore();

const headers = [
  { title: "Type", key: "type", width: "80px" },
  { title: "Category", key: "selectedCategory" },
  { title: "Amount", key: "amount", width: "150px", align: "end" },
  { title: "Description", key: "description", align: "center" },
  { title: "", key: "actions", width: "80px", sortable: false },
];

const categoryIcons = {
  Travel: "mdi-airplane",
  "Food and Drinks": "mdi-food",
  Grocery: "mdi-cart",
  "Fruits and Vegetables": "mdi-fruit-cherries",
  Rent: "mdi-home",
  Bills: "mdi-receipt",
  Shopping: "mdi-shopping",
  Fuel: "mdi-gas-station",
  Electricity: "mdi-lightning-bolt",
  General: "mdi-tag",
  Others: "mdi-dots-horizontal",
};

const getCategoryIcon = (category) => categoryIcons[category] || "mdi-tag";

const formatAmount = (amount) =>
  Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
</script>

<template>
  <v-card class="transactions-card d-flex flex-column overflow-hidden" elevation="0" rounded="xl">
    <!-- Header -->
    <v-card-title
      class="card-header d-block d-md-flex align-center justify-space-between px-6 py-4"
    >
      <div class="d-flex align-center ga-3 mb-3">
        <div class="header-icon d-flex align-center justify-center rounded-lg">
          <v-icon icon="mdi-swap-vertical-bold" size="24" color="white" />
        </div>
        <div>
          <h2 class="text-h6 font-weight-bold header-title">Transactions</h2>
        </div>
      </div>

      <!-- Summary Pills -->
      <div class="d-flex ga-3">
        <div
          class="summary-pill summary-pill--income d-flex align-center ga-1 px-3 py-1 rounded-pill"
        >
          <v-icon icon="mdi-arrow-down-bold" size="16" />
          <span class="font-weight-bold">₹{{ formatAmount(expenseStore.totalIncome) }}</span>
        </div>
        <div
          class="summary-pill summary-pill--expense d-flex align-center ga-1 px-3 py-1 rounded-pill"
        >
          <v-icon icon="mdi-arrow-up-bold" size="16" />
          <span class="font-weight-bold">₹{{ formatAmount(expenseStore.totalExpense) }}</span>
        </div>
      </div>
    </v-card-title>

    <v-divider />

    <!-- Data Table -->
    <v-data-table
      :headers="headers"
      :items="expenseStore.combinedList"
      class="transactions-table h-100"
      items-per-page="-1"
    >
      <!-- Type Column - Icon only, color-coded -->
      <template #item.type="{ item }">
        <div
          class="type-icon d-flex align-center justify-center rounded-lg"
          :class="item.type === 'income' ? 'type-icon--income' : 'type-icon--expense'"
        >
          <v-icon
            :icon="item.type === 'income' ? 'mdi-trending-up' : 'mdi-trending-down'"
            size="20"
          />
        </div>
      </template>

      <!-- Category Column - Grey chips -->
      <template #item.selectedCategory="{ item }">
        <div class="d-flex flex-wrap ga-1">
          <v-chip size="small" variant="flat">
            <v-icon :icon="getCategoryIcon(item.selectedCategory)" size="14" start />
            {{ item.selectedCategory }}
          </v-chip>
        </div>
      </template>

      <!-- Amount Column -->
      <template #item.amount="{ item }">
        <span
          class="amount-text font-weight-bold"
          :class="item.type === 'income' ? 'amount-text--income' : 'amount-text--expense'"
        >
          {{ item.type === "income" ? "+" : "-" }}₹{{ formatAmount(item.amount) }}
        </span>
      </template>

      <!-- Description Column -->
      <template #item.description="{ item }">
        <span class="description-text text-body-2">
          {{ item.description || "--" }}
        </span>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-btn icon variant="text" size="small" class="action-btn">
          <v-icon icon="mdi-dots-vertical" size="18" />
          <v-menu activator="parent">
            <v-list density="compact" rounded="lg" elevation="3">
              <v-list-item prepend-icon="mdi-pencil-outline" title="Edit" />
              <v-list-item prepend-icon="mdi-delete-outline" title="Delete" />
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="d-flex flex-column align-center justify-center pa-12">
          <div class="empty-icon d-flex align-center justify-center rounded-circle mb-4">
            <v-icon icon="mdi-wallet-outline" size="48" />
          </div>
          <h3 class="text-h6 empty-title">No transactions yet</h3>
          <p class="text-body-2 empty-subtitle mt-1">
            Start by adding your first income or expense
          </p>
        </div>
      </template>

      <!-- Footer -->
      <template #bottom>
        <v-divider />
        <div class="table-footer d-flex justify-end pa-4">
          <div
            class="net-balance d-flex flex-column align-end"
            :class="
              expenseStore.netBalance >= 0 ? 'net-balance--positive' : 'net-balance--negative'
            "
          >
            <span class="balance-label text-caption font-weight-bold text-uppercase">
              Net Balance
            </span>
            <div class="d-flex align-center ga-1 text-h6 font-weight-bold">
              <v-icon
                :icon="
                  expenseStore.netBalance >= 0 ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle'
                "
                size="20"
              />
              <span class="amount-text"
                >{{ expenseStore.netBalance > 0 ? "+" : "" }}₹{{
                  formatAmount(expenseStore.netBalance)
                }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: 400px;
  @media (min-width: 960px) {
    height: 500px;
  }
}
:deep(.v-table .v-data-table__th) {
  @media (prefers-color-scheme: dark) {
    color: var(--color-white-mute);
  }
}
.transactions-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.card-header {
  background: linear-gradient(135deg, rgba(125, 155, 132, 0.08) 0%, rgba(196, 112, 75, 0.05) 100%);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      rgba(125, 155, 132, 0.12) 0%,
      rgba(196, 112, 75, 0.08) 100%
    );
  }

  @media (max-width: 960px) {
    display: block !important;
    place-items: center;
  }
}

.header-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-sage) 0%, #5c7a63 100%);
}

.summary-pill {
  font-size: 0.875rem;

  &--income {
    background: rgba(125, 155, 132, 0.12);
    color: #5c7a63;

    @media (prefers-color-scheme: dark) {
      background: rgba(125, 155, 132, 0.2);
      color: #a8c4ae;
    }
  }

  &--expense {
    background: rgba(196, 112, 75, 0.12);
    color: #9e5535;

    @media (prefers-color-scheme: dark) {
      background: rgba(196, 112, 75, 0.2);
      color: #e8a889;
    }
  }
}

.transactions-table {
  background: transparent !important;
}

// Type Icon - Color-coded
.type-icon {
  width: 36px;
  height: 36px;

  &--income {
    background: rgba(125, 155, 132, 0.15);
    color: #5c7a63;

    @media (prefers-color-scheme: dark) {
      background: rgba(125, 155, 132, 0.25);
      color: #a8c4ae;
    }
  }

  &--expense {
    background: rgba(196, 112, 75, 0.15);
    color: #9e5535;

    @media (prefers-color-scheme: dark) {
      background: rgba(196, 112, 75, 0.25);
      color: #e8a889;
    }
  }
}

// Amount Text - Color-coded
.amount-text {
  letter-spacing: -0.5px;

  &--income {
    color: #5c7a63;

    @media (prefers-color-scheme: dark) {
      color: #a8c4ae;
    }
  }

  &--expense {
    color: #9e5535;

    @media (prefers-color-scheme: dark) {
      color: #e8a889;
    }
  }
}

.description-text {
  color: var(--color-text-secondary);
  text-align: left;
}

.action-btn {
  opacity: 0.5;
  transition: opacity var(--transition-fast);

  @media (prefers-color-scheme: dark) {
    color: #b0b0b0;
  }

  &:hover {
    opacity: 1;
  }
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(125, 155, 132, 0.12) 0%, rgba(196, 112, 75, 0.12) 100%);
  color: var(--color-sage);

  @media (prefers-color-scheme: dark) {
    color: #a8c4ae;
  }
}

.empty-title {
  color: var(--color-heading);
}

.empty-subtitle {
  color: var(--color-text-secondary);

  @media (prefers-color-scheme: dark) {
    color: #909090;
  }
}

.table-footer {
  background: var(--color-surface-variant);
}

.balance-label {
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);

  @media (prefers-color-scheme: dark) {
    color: #909090;
  }
}

.net-balance {
  &--positive {
    color: #5c7a63;

    @media (prefers-color-scheme: dark) {
      color: #a8c4ae;
    }
  }

  &--negative {
    color: #9e5535;

    @media (prefers-color-scheme: dark) {
      color: #e8a889;
    }
  }
}
</style>

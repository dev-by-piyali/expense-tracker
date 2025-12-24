<script setup>
import { ref, computed } from "vue";
import { useExpenseStore } from "@/stores/expenseStore";

const expenseStore = useExpenseStore();
const formData = ref({
  amount: null,
  description: "",
  selectedCategories: [],
});
const addSection = ref(false);
const incomeFlag = ref(false);
const expenseFlag = ref(false);

const incomeCategories = ["Salary", "Splitwise", "Refunds", "Others"];

const expenseCategories = [
  "Travel",
  "Food and Drinks",
  "Grocery",
  "Fruits and Vegetables",
  "Rent",
  "Bills",
  "Shopping",
  "Fuel",
  "Electricity",
  "Investments",
  "Splitwise",
  "General",
  "Others",
];

const sectionType = computed(() => {
  if (incomeFlag.value) return "income";
  if (expenseFlag.value) return "expense";
  return null;
});

const sectionTitle = computed(() => {
  return sectionType.value ?? "";
});

const showAddSection = (section, show) => {
  resetForm();
  incomeFlag.value = section === "income" && show;
  expenseFlag.value = section === "expense" && show;
  addSection.value = show;
};

const closeSection = () => {
  addSection.value = false;
  incomeFlag.value = false;
  expenseFlag.value = false;
};

const saveSection = (type) => {
  console.log("formData", formData.value);
  expenseStore.addItem(formData.value, type);
  closeSection();
};

const resetForm = () => {
  formData.value.amount = null;
  formData.value.selectedCategories = [];
  formData.value.description = "";
};

const allowOnlyNumbers = (event) => {
  if (["e", "E", "+", "-"].includes(event.key)) {
    event.preventDefault();
  }
};
</script>

<template>
  <div>
    <div class="d-flex flex-md-wrap ga-4 justify-center">
      <v-btn
        class="action-btn action-btn--income text-none text-subtitle-1 font-weight-bold"
        variant="flat"
        size="large"
        min-width="160"
        prepend-icon="mdi-tray-arrow-down"
        @click="showAddSection('income', true)"
      >
        Add Income
      </v-btn>

      <v-btn
        class="action-btn action-btn--expense text-none text-subtitle-1 font-weight-bold"
        variant="flat"
        size="large"
        min-width="160"
        prepend-icon="mdi-tray-arrow-up"
        @click="showAddSection('expense', true)"
      >
        Add Expense
      </v-btn>
    </div>

    <v-expand-transition>
      <v-card
        v-if="addSection"
        class="transaction-card mt-6"
        :class="incomeFlag ? 'transaction-card--income' : 'transaction-card--expense'"
        elevation="0"
        rounded="lg"
      >
        <v-card-title
          class="card-header d-flex align-center justify-space-between pa-4"
          :class="incomeFlag ? 'card-header--income' : 'card-header--expense'"
        >
          <div class="d-flex align-center ga-3">
            <v-icon
              :icon="incomeFlag ? 'mdi-arrow-down-bold-circle' : 'mdi-arrow-up-bold-circle'"
              size="28"
            />
            <span class="text-h6 text-capitalize font-weight-bold">
              {{ sectionTitle }}
            </span>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-btn"
            @click="closeSection"
          />
        </v-card-title>

        <v-divider class="divider" />

        <v-card-text class="pa-6">
          <v-autocomplete
            v-model="formData.selectedCategories"
            :items="incomeFlag ? incomeCategories : expenseCategories"
            label="Category"
            placeholder="Select categories..."
            prepend-inner-icon="mdi-tag-multiple"
            clearable
            chips
            multiple
            closable-chips
            variant="outlined"
            density="comfortable"
            rounded="lg"
            class="themed-input"
          />

          <v-text-field
            v-model="formData.amount"
            label="Amount"
            type="number"
            placeholder="Enter amount"
            prepend-inner-icon="mdi-currency-inr"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            @keypress="allowOnlyNumbers"
            class="themed-input mt-4"
          />

          <v-textarea
            v-model="formData.description"
            label="Description"
            placeholder="Enter a description..."
            prepend-inner-icon="mdi-text"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            rows="3"
            auto-grow
            class="themed-input mt-4"
          />
        </v-card-text>

        <v-divider class="divider" />

        <v-card-actions class="pa-4 justify-end ga-2">
          <v-btn class="text-none text-subtitle-1 cancel-btn" variant="text" @click="closeSection">
            Cancel
          </v-btn>
          <v-btn
            class="text-none text-subtitle-1 save-btn"
            :class="incomeFlag ? 'save-btn--income' : 'save-btn--expense'"
            variant="flat"
            :disabled="!formData.amount || !formData.selectedCategories.length"
            prepend-icon="mdi-check"
            @click="saveSection(sectionType)"
          >
            Save {{ sectionTitle }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
// Use the CSS custom properties from main.scss
.transaction-wrapper {
  background: var(--color-background);
}

// Action Buttons using theme colors
.action-btn {
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);

  &--income {
    background: var(--color-sage);
    color: var(--color-white);

    &:hover {
      background: var(--color-sage, #5c7a63);
    }
  }

  &--expense {
    background: var(--color-terracotta);
    color: var(--color-white);

    &:hover {
      background: var(--color-terracotta, #9e5535);
    }
  }
}

// Transaction Card
.transaction-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin-inline: auto;

  &--income {
    border-top: 4px solid var(--color-sage, #7d9b84);
  }

  &--expense {
    border-top: 4px solid var(--color-terracotta, #c4704b);
  }
}

// Card Header
.card-header {
  transition: background var(--transition-base);

  &--income {
    background: linear-gradient(
      135deg,
      rgba(125, 155, 132, 0.15) 0%,
      rgba(125, 155, 132, 0.05) 100%
    );
    color: var(--color-heading);

    .v-icon {
      color: var(--color-sage, #7d9b84);
    }
  }

  &--expense {
    background: linear-gradient(135deg, rgba(196, 112, 75, 0.15) 0%, rgba(196, 112, 75, 0.05) 100%);
    color: var(--color-heading);

    .v-icon {
      color: var(--color-terracotta, #c4704b);
    }
  }
}

.close-btn {
  color: var(--color-text-muted);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-text);
  }
}

// Divider
.divider {
  border-color: var(--color-border);
}

// Themed Form Inputs - Enhanced for Dark Mode
.themed-input {
  :deep(.v-field) {
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
  }

  :deep(.v-field--focused) {
    border-color: var(--color-accent);
  }

  // Label styling
  :deep(.v-label) {
    color: var(--color-text-secondary);

    @media (prefers-color-scheme: dark) {
      color: #a0a0a0;
    }
  }

  // Input text color
  :deep(.v-field__input) {
    color: var(--color-text);

    @media (prefers-color-scheme: dark) {
      color: #d0d0d0;
    }

    &::placeholder {
      color: var(--color-text-muted);

      @media (prefers-color-scheme: dark) {
        color: #808080;
      }
    }
  }

  // Prepend inner icons (category, amount, description icons)
  :deep(.v-field__prepend-inner) {
    .v-icon {
      color: var(--color-text-secondary);

      @media (prefers-color-scheme: dark) {
        color: #9e9e9e;
      }
    }
  }

  // Clear icon
  :deep(.v-field__clearable) {
    .v-icon {
      @media (prefers-color-scheme: dark) {
        color: #9e9e9e;
      }
    }
  }

  // Append inner icons (dropdown arrow)
  :deep(.v-field__append-inner) {
    .v-icon {
      @media (prefers-color-scheme: dark) {
        color: #9e9e9e;
      }
    }
  }

  // Outlined field border
  :deep(.v-field--variant-outlined .v-field__outline) {
    @media (prefers-color-scheme: dark) {
      --v-field-border-opacity: 0.3;
    }
  }
}

// Expense variant chips
.transaction-card--expense {
  .themed-input {
    :deep(.v-chip) {
      background: var(--color-surface);
      color: var(--color-text-secondary);
      border: 1px solid rgba(196, 112, 75, 0.4);

      .v-chip__close {
        color: #e8a889;

        &:hover {
          color: #ffffff;
        }
      }
    }
  }
}

// Income variant chips
.transaction-card--income {
  .themed-input {
    :deep(.v-chip) {
      @media (prefers-color-scheme: light) {
        background: var(--color-surface);
        color: var(--color-text-secondary);
        border: 1px solid rgba(125, 155, 132, 0.4);

        .v-chip__close {
          color: #a8c4ae;

          &:hover {
            color: #ffffff;
          }
        }
      }
    }
  }
}

// Cancel Button
.cancel-btn {
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);

  @media (prefers-color-scheme: dark) {
    color: #a0a0a0;
  }

  &:hover {
    color: var(--color-text);
    background: var(--color-surface-variant);

    @media (prefers-color-scheme: dark) {
      color: #e0e0e0;
    }
  }
}

// Save Button
.save-btn {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);

  &--income {
    background: var(--color-sage, #7d9b84);
    color: var(--color-white);
  }

  &--expense {
    background: var(--color-terracotta, #c4704b);
    color: var(--color-white);
  }
}
</style>

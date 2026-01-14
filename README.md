# Expense Tracker

A modern, feature-rich expense tracker application built with Vue 3 and Vuetify. Track your income and expenses, visualize spending patterns, and manage your finances with an intuitive interface.

## Features

- **Add Transactions**: Easily add income and expense entries with categories, amounts, and descriptions
- **Transaction History**: View all your transactions in an organized table with edit and delete capabilities
- **Smart Categories**: Pre-defined categories for income and expenses with category icons
- **Dashboard Analytics**: Multiple chart visualizations including:
  - Income vs Expenses comparison
  - Expense breakdown by category
  - Income breakdown by category
  - Monthly trend analysis
- **Monthly Filtering**: View transactions and analytics for different months
- **Dark Mode Support**: Fully responsive design with light and dark theme support
- **Balance Tracking**: Real-time display of total income, total expenses, and net balance

## Components

### AddIncomeExpense
Component for adding and editing transactions with:
- Separate forms for income and expense types
- Category selection with autocomplete
- Amount input with validation
- Description field
- Edit mode for updating existing transactions

### Dashboard
Analytics dashboard featuring:
- Chart.js visualizations
- 4 different chart types (Bar, Doughnut, Line)
- Monthly trend tracking
- Responsive grid layout
- Category-wise breakdowns

### ExpenseHistory
Transaction management table with:
- Sortable data table
- Transaction details (type, category, amount, description)
- Edit and delete actions
- Summary pills showing totals
- Net balance display
- Empty state messaging

## Income Categories

- Salary
- Splitwise
- Refunds
- Others

## Expense Categories

- Travel
- Food and Drinks
- Grocery
- Fruits and Vegetables
- Rent
- Bills
- Shopping
- Fuel
- Electricity
- Investments
- Splitwise
- General
- Others

## Technology Stack

- **Vue 3**: Progressive JavaScript framework
- **Vuetify**: Material Design component framework
- **Chart.js**: JavaScript charting library
- **SCSS**: Styling with custom CSS variables and dark mode support
- **Pinia**: State management via expenseStore

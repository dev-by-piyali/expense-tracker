import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles"; // Import Vuetify styles
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // Import MDI font
import "./assets/main.scss";

const vuetify = createVuetify({
  components,
  directives,
  // Optional: Add global configuration here (e.g., themes, icons)
});

createApp(App).use(vuetify).mount("#app");

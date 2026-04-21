import { createApp } from 'vue';
import App from './App.vue';

// VueFlow base + theme
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

// Project design tokens + topology styles
import './styles/design-tokens.css';
import './styles/topology.css';

createApp(App).mount('#app');

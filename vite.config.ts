import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), keycloakify({
    accountThemeImplementation: "none",
    themeName: "keycloak-dpop",
    keycloakVersionTargets: {
      "22-to-25": false,
      "all-other-versions": "keycloak-admin-dpop.jar"
    }
  })]
});
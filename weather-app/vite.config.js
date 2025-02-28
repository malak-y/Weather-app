import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/weather-app/", // Use your GitHub repo name here
  plugins: [react()],
});

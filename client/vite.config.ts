import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
const root = path.resolve(__dirname, "src");
export default defineConfig({
	plugins: [
		react(),
	],
	css: {
        postcss: {
            plugins: [
                require('tailwindcss')({
                    config: './tailwind.config.js',
					autoprefixer: {},
                }),
             ],
        }
    },
	resolve: {
		alias: {
		  "@": path.resolve(root),
		}
	  }
})

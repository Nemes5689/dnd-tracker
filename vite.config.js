import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // For GitHub Pages: change 'dnd-tracker' to your repo name
        // If deploying to root domain, use '/'
        base: mode === 'electron' ? './' : '/dnd-tracker/',
    });
});

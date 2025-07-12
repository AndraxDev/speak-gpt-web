import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            chunkSizeWarningLimit: 1600
        },
        plugins: [
            react(),
            eslint({
                overrideConfigFile: '.eslint.cjs',
                cache: false,
                include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
                exclude: ['node_modules'],
            }),
        ],
        server: {
            port: 3000,
        },
    };
});
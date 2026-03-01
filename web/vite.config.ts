
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            globals: {
                Buffer: true,
            },
            protocolImports: true,
        }),
    ],
    server: {
        port: 3240,
        strictPort: true,
        host: true,
        allowedHosts: [
            "localhost",
            "127.0.0.1",
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})

import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import rollupResolve from '@rollup/plugin-node-resolve';
import createTDesignPlugin from './plugin-tdoc';

const publicPathMap: Record<string, string> = {
  preview: '/',
  intranet: '/miniprogram/',
  production: 'https://static.tdesign.tencent.com/miniprogram/',
};

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  return defineConfig({
    base: publicPathMap[mode],
    root: path.resolve(__dirname),
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '..'),
        '@': path.resolve(__dirname, '../src'),
        '@common': path.resolve(__dirname, '../common'),
        '@components': path.resolve(__dirname, './components'),
        '@docs': path.resolve(__dirname, './docs'),
        '@pages': path.resolve(__dirname, './pages'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 19000,
      open: '/',
      https: false,
      proxy: {
        //代理所有 /m2w 的请求
        '/m2w': {
          // 代理请求之后的请求地址
          target: 'http://127.0.0.1:8080',
          // 跨域配置
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../_site',
      rollupOptions: {
        input: {
          site: path.resolve(__dirname, 'index.html'),
        },
        plugins: [
          rollupResolve({
            moduleDirectories: [path.resolve(__dirname, 'node_modules')],
          }),
        ],
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('td-'),
          },
        },
      }),
      vueJsx(),
      createTDesignPlugin(),
    ],
  });
};

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"./",
  // resolve:{
  //   alias:{
  //     component:resolve(__dirname,'src/components/'),
  //     '/images':'./src/assets/images'
  //   }
  // },
  build: {
    minify:'terser',
    terserOptions: {
        compress: {
            //生产环境时移除console
            drop_console: true,
            drop_debugger: true,
        },
    },
    // 取消计算文件大小，加快打包速度
    reportCompressedSize: false,
    //sourcemap: true,
    // assetsDir: 'static/img',
    rollupOptions: {
        output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
    },
  },
  server:{
      open:true
  }
})

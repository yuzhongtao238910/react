import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
export default defineConfig({
	resolve: {
		alias: {
			// 通过使用path.posix.resolve，你可以确保无论你的应用程序在哪个操作系统上运行，路径都将以POSIX风格的方式解析，
			// 即使用正斜杠/作为路径分隔符。这在编写跨平台应用程序时特别有用，因为它可以帮助确保路径的一致性和可预测性。
			"react": path.posix.resolve("src/react"),
			// windows 和 linux 路径分隔符号不一样
			"react-dom": path.posix.resolve("src/react-dom"),
			"react-reconciler": path.posix.resolve("src/react-reconciler"),
			"scheduler": path.posix.resolve("src/scheduler"),
			"shared": path.posix.resolve("src/shared"),
			'react-dom-bindings': path.posix.resolve("src/react-dom-bindings")
		}
	},
	plugins: [
		react()
	]
})

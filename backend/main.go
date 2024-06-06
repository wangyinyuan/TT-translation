package main

import (
	"src/initialize"
)

func main() {
	//解析配置
	initialize.SetupConfig()

	// 创建 Gin 引擎，设置路由
	r := initialize.SetupRouters()

	// 启动服务器
	r.Run("0.0.0.0:8080")
}

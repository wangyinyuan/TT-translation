package main

import (
	"log"

	"src/initialize"
)

func main() {

	// 初始化log前缀
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	//解析配置
	initialize.SetupConfig()

	// 创建 Gin 引擎，设置路由
	r := initialize.SetupRouters()

	// 启动服务器
	r.Run("0.0.0.0:8080")
}

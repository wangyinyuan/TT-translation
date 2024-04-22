package main

import (
	"src/controller"

	"github.com/gin-gonic/gin"
)

func main() {
	// 创建 Gin 引擎
	r := gin.Default()

	// 设置路由
	r.GET("/translate", controller.TranslateHandler)

	// 启动服务器
	r.Run(":8080")
}

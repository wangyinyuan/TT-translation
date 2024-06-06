package main

import (
	"fmt"
	"src/controller"
	"src/global"

	"github.com/gin-gonic/gin"
)

func main() {
	//解析配置
	_, err := global.LoadConfig()
	if err != nil {
		fmt.Println("resolve config error:", err)
	}
	if err == nil {

		fmt.Println("resolve config success")
	}
	// 创建 Gin 引擎
	r := gin.Default()

	// 设置路由
	r.GET("/translate", controller.TranslateHandler)
	r.POST("/speechTranslate", controller.SpeechTranslateHandler)

	// 启动服务器
	r.Run("0.0.0.0:8080")
}

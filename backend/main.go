package main

import (
	"src/controller"
	"src/global"

	"github.com/gin-gonic/gin"
)

func main() {
	//解析配置
	global.LoadConfig()

	// 创建 Gin 引擎
	r := gin.Default()

	// 设置路由
	r.GET("/translate", controller.TranslateHandler)
	r.POST("/speechTranslate", controller.SpeechTranslateHandler)
	// r.GET("/text-to-speech", controller.TextToSpeechHandler)
	// 启动服务器
	r.Run("0.0.0.0:8080")
}

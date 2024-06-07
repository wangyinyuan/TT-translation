package main

import (
	"log"
	"src/controller"
	"src/global"

	"github.com/gin-gonic/gin"
)

func main() {

	// 初始化log前缀
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// 解析配置
	_, err := global.LoadConfig()
	if err != nil {
		log.Println("resolve config error:", err)
	}
	if err == nil {

		log.Println("resolve config success")
	}
	// 创建 Gin 引擎
	r := gin.Default()

	// 设置路由
	r.GET("/translate", controller.TranslateHandler)
	r.POST("/speechTranslate", controller.SpeechTranslateHandler)

	// 启动服务器
	r.Run("0.0.0.0:8080")
}

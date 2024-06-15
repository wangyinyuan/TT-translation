package initialize

import (
	"src/controller"

	"github.com/gin-gonic/gin"
)

func SetupRouters() *gin.Engine {

	// 创建 Gin 引擎
	r := gin.Default()

	// 设置路由
	r.GET("/translate", controller.TranslateHandler)
	r.POST("/speechTranslate", controller.SpeechTranslateHandler)

	return r
}

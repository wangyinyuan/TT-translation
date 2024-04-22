package controller

import (
	"net/http"
	"src/model"
	"src/service"

	"github.com/gin-gonic/gin"
)

func TranslateHandler(c *gin.Context) {
	// 解析前端发送过来的 JSON 数据
	var req model.TranslateRequest
	req.Text = c.Query("text")
	req.TargetLang = c.Query("target_language")
	req.SourceLang = c.Query("source_language")

	// 调用 service 层的 Translate 方法进行翻译
	translation, err := service.Translate(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to translate"})
		return
	}

	// 将翻译结果返回给前端
	c.JSON(http.StatusOK, gin.H{"translation": translation})

}

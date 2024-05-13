package controller

import (
	"net/http"
	"src/model"
	"src/service"

	"github.com/gin-gonic/gin"
)

func SpeechTranslateHandler(c *gin.Context) {
	// 解析前端发送过来的音频文件
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	defer file.Close()

	// 调用语音识别的服务
	result, err := service.OrganizeSpeech(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recognize speech"})
		return
	}

	// 解析前端发送过来的 JSON 数据
	var req model.TranslateRequest
	req.Text = result
	req.TargetLang = c.PostForm("target_language")
	req.SourceLang = c.PostForm("source_language")

	// 调用 service 层的 Translate 方法进行翻译
	translation, err := service.Translate(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to translate"})
		return
	}

	// todo 暂时将合成朗读音频的链接设为空字符串
	audioURL := ""

	// 构建返回给前端的结构体
	response := model.SpeechTranslationResponse{
		RecognitionResult: result,
		TranslationResult: translation,
		AudioURL:          audioURL,
	}

	// 将结果返回给前端
	c.JSON(http.StatusOK, response)
}

package controller

import (
	"net/http"
	"src/model"
	"src/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	// 调用 sevice 层的 TextToSpeech 方法合成原始语言和目标语言的文本音频
	speechResult1, err1 := service.TextToSpeech(req.Text, uuid.New().String())
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get source text speech"})
		return
	}

	speechResult2, err2 := service.TextToSpeech(translation, uuid.New().String())
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get translation speech"})
		return
	}

	audio1 := speechResult1.Response.Audio
	audio2 := speechResult2.Response.Audio

	sourceSpeechResponse := model.TTSResponce{
		Audio: *audio1,
	}
	targetSpeechResponse := model.TTSResponce{
		Audio: *audio2,
	}

	// 构建返回前端的结构体
	translateResponse := model.TranslateResponse{
		Translation:          translation,
		SourceSpeechResponse: sourceSpeechResponse,
		TargetSpeechResponse: targetSpeechResponse,
	}

	// 将翻译结果返回给前端
	c.JSON(http.StatusOK, translateResponse)

}

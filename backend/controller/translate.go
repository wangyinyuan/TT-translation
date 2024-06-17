package controller


import (
	"net/http"
	"src/model"
	"src/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)


func parseTranslateRequest(c *gin.Context) model.TranslateRequest {
	return model.TranslateRequest{
		Text:       c.Query("text"),
		TargetLang: c.Query("target_language"),
		SourceLang: c.Query("source_language"),
	}
}

func performTranslation(req model.TranslateRequest) (string, error) {
	return service.Translate(req)
}

func generateSpeech(text string) (string, error) {
	speechResult, err := service.TextToSpeech(text, uuid.New().String())
	if err != nil {
		return "", err
	}
	return *speechResult.Response.Audio, nil
}

func TranslateHandler(c *gin.Context) {
	req := parseTranslateRequest(c)

	translation, err := performTranslation(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to translate"})
		return
	}

	audio1, err1 := generateSpeech(req.Text)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get source text speech"})
		return
	}

	audio2, err2 := generateSpeech(translation)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get translation speech"})
		return
	}

	sourceSpeechResponse := model.TTSResponce{
		Audio: audio1,
	}
	targetSpeechResponse := model.TTSResponce{
		Audio: audio2,
	}

	translateResponse := model.TranslateResponse{
		Translation:          translation,
		SourceSpeechResponse: sourceSpeechResponse,
		TargetSpeechResponse: targetSpeechResponse,
	}

	c.JSON(http.StatusOK, translateResponse)
}

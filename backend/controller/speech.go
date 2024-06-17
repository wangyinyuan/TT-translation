package controller

import (
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"github.com/google/uuid"
	"src/service"
	"src/model"
)

func removeBracketsAndContents(input string) string {
	re := regexp.MustCompile(`\[[^\]]*\]`)
	return re.ReplaceAllString(input, "")
}

func saveUploadedFile(c *gin.Context) (string, error) {
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		return "", err
	}
	defer file.Close()

	fileName := uuid.New().String() + filepath.Ext(fileHeader.Filename)
	uploadsDir := "./uploads/"
	filePath := filepath.Join(uploadsDir, fileName)

	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		err = os.MkdirAll(uploadsDir, 0755)
		if err != nil {
			return "", err
		}
	}

	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	_, err = io.Copy(f, file)
	if err != nil {
		os.Remove(filePath)
		return "", err
	}

	return filePath, nil
}

func recognizeSpeech(filePath string) (string, error) {
	organizeResponse, err := service.OrganizeSpeech(filePath)
	if err != nil {
		return "", err
	}

	result := *organizeResponse.Response.Data.Result
	result = removeBracketsAndContents(result)
	result = strings.TrimSpace(result)
	return result, nil
}

func translateText(req model.TranslateRequest) (string, error) {
	return service.Translate(req)
}

func synthesizeSpeech(text string) (string, error) {
	speechResult, err := service.TextToSpeech(text, uuid.New().String())
	if err != nil {
		return "", err
	}
	return *speechResult.Response.Audio, nil
}

func SpeechTranslateHandler(c *gin.Context) {
	filePath, err := saveUploadedFile(c)
	if err != nil {
		log.Println("Error saving the file:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	defer func() {
		if err := os.Remove(filePath); err != nil {
			log.Printf("Error removing temporary file %s: %v\n", filePath, err)
		}
	}()

	result, err := recognizeSpeech(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recognize speech"})
		return
	}

	var req model.TranslateRequest
	req.Text = result
	req.TargetLang = c.PostForm("target_language")
	req.SourceLang = c.PostForm("source_language")

	translation, err := translateText(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to translate"})
		return
	}

	audio1, err1 := synthesizeSpeech(req.Text)
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get source text speech"})
		return
	}

	audio2, err2 := synthesizeSpeech(translation)
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

	response := model.SpeechTranslationResponse{
		RecognitionResult:    result,
		TranslationResult:    translation,
		SourceSpeechResponse: sourceSpeechResponse,
		TargetSpeechResponse: targetSpeechResponse,
	}

	c.JSON(http.StatusOK, response)
}

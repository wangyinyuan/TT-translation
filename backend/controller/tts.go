package controller

// import (
// 	"net/http"
// 	"src/service"

// 	"github.com/gin-gonic/gin"
// )

// // TextToSpeechHandler handles text-to-speech requests
// func TextToSpeechHandler(c *gin.Context) {
// 	text := c.Query("text")
// 	language := c.Query("language")

// 	if text == "" || language == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Text and language parameters are required"})
// 		return
// 	}

// 	// Call the service to generate speech
// 	audioData, err := service.TextToSpeech(text, language)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate speech"})
// 		return
// 	}

// 	// Send the file as response
// 	c.Header("Content-Type", "audio/wav")
// 	c.Header("Content-Disposition", "attachment; filename=speech.wav")
// 	c.Data(http.StatusOK, "audio/wav", audioData)
// }

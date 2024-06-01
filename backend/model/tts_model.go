package model

type TTSRequest struct {
	Text     string `json:"text" binding:"required"`
	Language string `json:"language" binding:"required"`
}

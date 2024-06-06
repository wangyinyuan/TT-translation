package model

// 返回前端的语音翻译服务响应结构体
type SpeechTranslationResponse struct {
	RecognitionResult    string `json:"recognition_result"`
	TranslationResult    string `json:"translation_result"`
	SourceSpeechResponse TTSResponce
	TargetSpeechResponse TTSResponce
}

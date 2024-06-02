package model

type SpeechTranslationResponse struct {
	RecognitionResult string `json:"recognition_result"`
	TranslationResult string `json:"translation_result"`
	// AudioURL             string `json:"audio_url"`
	SourceSpeechResponce TTSResponce
	TargetSpeechResponce TTSResponce
}

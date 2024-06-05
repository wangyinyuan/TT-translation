package model

type TranslateRequest struct {
	Text       string `json:"text"`
	SourceLang string `json:"source_lang"`
	TargetLang string `json:"target_lang"`
}

type TranslateResponse struct {
	Translation          string `json:"translation"`
	SourceSpeechResponse TTSResponce
	TargetSpeechResponse TTSResponce
}

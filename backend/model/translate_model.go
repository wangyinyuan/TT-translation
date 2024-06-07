package model

// 从前端接收的文本翻译请求结构体
type TranslateRequest struct {
	Text       string `json:"text"`
	SourceLang string `json:"source_lang"`
	TargetLang string `json:"target_lang"`
}

// 返回给前端的文本翻译响应结构体
type TranslateResponse struct {
	Translation          string `json:"translation"`
	SourceSpeechResponse TTSResponce
	TargetSpeechResponse TTSResponce
}

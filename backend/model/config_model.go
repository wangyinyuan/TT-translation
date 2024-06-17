package model

// AppConfig 定义了App的配置结构体
type AppConfig struct {
	SecretID  string `json:"SecretID"`
	SecretKey string `json:"SecretKey"`
}

// ServiceConfig 定义了Service的配置结构体
type ServiceConfig struct {
	Speech struct {
		ASR string `json:"ASR"`
		TTS string `json:"TTS"`
	} `json:"Speech"`
	Translate string `json:"Translate"`
}

// Config 定义了整个配置的结构体
type Config struct {
	App     AppConfig     `json:"App"`
	Service ServiceConfig `json:"Service"`
}
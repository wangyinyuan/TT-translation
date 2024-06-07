package config

import (
	"encoding/json"
	"log"
	"os"
)

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

func LoadConfig(filePath string) (*Config, error) {
	// 读取文件内容
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// 解析JSON到Config结构体
	var config Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	// 打印配置信息
	log.Println("App SecretID:", config.App.SecretID)
	log.Println("ASR Endpoint:", config.Service.Speech.ASR)
	log.Println("TTS Endpoint:", config.Service.Speech.TTS)
	log.Println("Translate Endpoint:", config.Service.Translate)

	return &config, nil
}

package config

import (
	"encoding/json"
	"log"
	"os"

	"src/model"
)

func LoadConfig(filePath string) (*model.Config, error) {
	// 读取文件内容
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// 解析JSON到Config结构体
	var config model.Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	printInfo(config)	

	return &config, nil
}

func printInfo(config model.Config){
// 打印配置信息
	log.Println("App SecretID:", config.App.SecretID)
	log.Println("ASR Endpoint:", config.Service.Speech.ASR)
	log.Println("TTS Endpoint:", config.Service.Speech.TTS)
	log.Println("Translate Endpoint:", config.Service.Translate)
}
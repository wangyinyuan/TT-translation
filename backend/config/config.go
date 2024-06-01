package config

import (
	"encoding/json"
	"fmt"
	"os"
)

// Config 定义了配置的结构体
type Config struct {
	App struct {
		SecretID  string `json:"SecretID"`
		SecretKey string `json:"SecretKey"`
	} `json:"App"`
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
	fmt.Println("config is:", config.App.SecretID)
	return &config, nil
}

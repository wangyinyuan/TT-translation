package global

import (
	"fmt"
	"src/config"
)

var (
	GVA_CONFIG *config.Config
)

// LoadConfig 从文件中加载配置
func LoadConfig() (*config.Config, error) {
	var err error
	GVA_CONFIG, err = config.LoadConfig("config/config.json")
	if err != nil {
		fmt.Println("Error loading config:", err)
		//os.Exit(1)
		return nil, err
	}

	// 打印解析结果
	fmt.Println("App SecretID in global:", GVA_CONFIG.App.SecretID)
	fmt.Println("ASR Endpoint in global:", GVA_CONFIG.Service.Speech.ASR)
	fmt.Println("TTS Endpoint in global:", GVA_CONFIG.Service.Speech.TTS)
	fmt.Println("Translate Endpoint in global:", GVA_CONFIG.Service.Translate)

	return GVA_CONFIG, nil
}

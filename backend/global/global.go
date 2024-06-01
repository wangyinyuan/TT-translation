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
	fmt.Println("config in global:", GVA_CONFIG.App.SecretID)
	fmt.Println("config in global:", GVA_CONFIG.App.SecretKey)
	return GVA_CONFIG, nil
}

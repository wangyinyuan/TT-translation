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
	GVA_CONFIG, err := config.LoadConfig("config.json")
	if err != nil {
		fmt.Println("Error loading config:", err)
		//os.Exit(1)
		return nil, err
	}

	return GVA_CONFIG, nil
}

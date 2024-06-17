package global

import (
	"log"
	"src/config"
	"src/model"
)

var (
	GVA_CONFIG *model.Config
)

// LoadConfig 从配置文件中加载配置到GVA_CONFIG
func LoadConfig() (*model.Config, error) {
	// 调用 config 包的解析函数，从配置文件路径解析配置文件
	var err error
	GVA_CONFIG, err = config.LoadConfig("config/config.json")
	if err != nil {
		log.Println("Error loading config:", err)
		//os.Exit(1)
		return nil, err
	}
	
    // 打印配置信息  
    printConfigInfo()  

	return GVA_CONFIG, nil
}

// printConfigInfo 打印配置信息到日志  
func printConfigInfo() {  
    if GVA_CONFIG != nil {  
        log.Println("App SecretID in global:", GVA_CONFIG.App.SecretID)  
        log.Println("ASR Endpoint in global:", GVA_CONFIG.Service.Speech.ASR)  
        log.Println("TTS Endpoint in global:", GVA_CONFIG.Service.Speech.TTS)  
        log.Println("Translate Endpoint in global:", GVA_CONFIG.Service.Translate)  
    }  
}  
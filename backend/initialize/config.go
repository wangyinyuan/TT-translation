package initialize

import (
	"fmt"
	"src/global"
)

func SetupConfig() {
	//解析配置
	_, err := global.LoadConfig()
	if err != nil {
		fmt.Println("resolve config error:", err)
	}
	if err == nil {

		fmt.Println("resolve config success")
	}
}

package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"src/model"
)

// Translate 方法用于向 deeplx API 发送翻译请求并返回翻译结果和源语言
func Translate(translateReq model.TranslateRequest) (string, error) {
	// 将请求体转换为 JSON
	requestBody, err := json.Marshal(translateReq)
	if err != nil {
		return "", err
	}

	// 发送 POST 请求到 deeplx API
	response, err := http.Post("https://api.deeplx.org/translate", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	// 读取 API 响应
	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	// 解析 API 响应
	var translateRes map[string]interface{}
	if err := json.Unmarshal(responseData, &translateRes); err != nil {
		return "", err
	}

	// 提取翻译结果和源语言
	translation, translationOk := translateRes["data"].(string)

	if translationOk {
		return translation, nil
	}

	return "", err
}

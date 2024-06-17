package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"src/global"
	"src/model"
	"fmt"
)

// // 发送翻译请求并返回翻译结果
// func Translate(translateReq model.TranslateRequest) (string, error) {
// 	// 将请求体转换为 JSON
// 	requestBody, err := json.Marshal(translateReq)
// 	if err != nil {
// 		return "", err
// 	}

// 	// 发送 POST 请求到 deeplx API
// 	response, err := http.Post(global.GVA_CONFIG.Service.Translate, "application/json", bytes.NewBuffer(requestBody))
// 	if err != nil {
// 		return "", err
// 	}
// 	defer response.Body.Close()

// 	// 读取 API 响应
// 	responseData, err := io.ReadAll(response.Body)
// 	if err != nil {
// 		return "", err
// 	}

// 	// 解析 API 响应
// 	var translateRes map[string]interface{}
// 	if err := json.Unmarshal(responseData, &translateRes); err != nil {
// 		return "", err
// 	}

// 	// 提取翻译结果
// 	translation, translationOk := translateRes["data"].(string)

// 	if translationOk {
// 		return translation, nil
// 	}

// 	return "", err
// }
// func Translate(translateReq model.TranslateRequest) (string, error) {
// 	// 将请求体转换为 JSON
// 	requestBody, err := json.Marshal(translateReq)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to marshal request body: %w", err)
// 	}

// 	// 发送 POST 请求到 deeplx API
// 	response, err := http.Post(global.GVA_CONFIG.Service.Translate, "application/json", bytes.NewBuffer(requestBody))
// 	if err != nil {
// 		return "", fmt.Errorf("failed to send POST request: %w", err)
// 	}
// 	defer response.Body.Close()

// 	// 读取 API 响应
// 	responseData, err := io.ReadAll(response.Body)
// 	if err != nil {
// 		return "", fmt.Errorf("failed to read response body: %w", err)
// 	}

// 	// 检查响应状态码
// 	if response.StatusCode != http.StatusOK {
// 		return "", fmt.Errorf("received non-200 response status: %d, body: %s", response.StatusCode, string(responseData))
// 	}

// 	// 解析 API 响应
// 	var translateRes map[string]interface{}
// 	if err := json.Unmarshal(responseData, &translateRes); err != nil {
// 		return "", fmt.Errorf("failed to unmarshal response body: %w", err)
// 	}

// 	// 提取翻译结果
// 	translation, translationOk := translateRes["data"].(string)
// 	if !translationOk {
// 		return "", fmt.Errorf("translation data not found in response: %s", string(responseData))
// 	}

// 	return translation, nil
// }
// 将请求体转换为 JSON
func marshalRequestBody(translateReq model.TranslateRequest) ([]byte, error) {
    requestBody, err := json.Marshal(translateReq)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request body: %w", err)
    }
    return requestBody, nil
}

// 发送 POST 请求到 deeplx API
func sendPostRequest(url string, requestBody []byte) (*http.Response, error) {
    response, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
    if err != nil {
        return nil, fmt.Errorf("failed to send POST request: %w", err)
    }
    return response, nil
}

// 读取 API 响应
func readResponseBody(response *http.Response) ([]byte, error) {
    responseData, err := io.ReadAll(response.Body)
    if err != nil {
        return nil, fmt.Errorf("failed to read response body: %w", err)
    }
    return responseData, nil
}

// 检查响应状态码
func checkResponseStatus(response *http.Response, responseData []byte) error {
    if response.StatusCode != http.StatusOK {
        return fmt.Errorf("received non-200 response status: %d, body: %s", response.StatusCode, string(responseData))
    }
    return nil
}

// 解析 API 响应
func unmarshalResponseBody(responseData []byte) (map[string]interface{}, error) {
    var translateRes map[string]interface{}
    if err := json.Unmarshal(responseData, &translateRes); err != nil {
        return nil, fmt.Errorf("failed to unmarshal response body: %w", err)
    }
    return translateRes, nil
}

// 提取翻译结果
func extractTranslation(translateRes map[string]interface{}) (string, error) {
    translation, translationOk := translateRes["data"].(string)
    if !translationOk {
        return "", fmt.Errorf("translation data not found in response")
    }
    return translation, nil
}

// 翻译主函数
func Translate(translateReq model.TranslateRequest) (string, error) {
    requestBody, err := marshalRequestBody(translateReq)
    if err != nil {
        return "", err
    }

    response, err := sendPostRequest(global.GVA_CONFIG.Service.Translate, requestBody)
    if err != nil {
        return "", err
    }
    defer response.Body.Close()

    responseData, err := readResponseBody(response)
    if err != nil {
        return "", err
    }

    if err := checkResponseStatus(response, responseData); err != nil {
        return "", err
    }

    translateRes, err := unmarshalResponseBody(responseData)
    if err != nil {
        return "", err
    }

    translation, err := extractTranslation(translateRes)
    if err != nil {
        return "", err
    }

    return translation, nil
}

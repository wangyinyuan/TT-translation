package service

import (
	"log"
	"src/global"

	"fmt"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	tts "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tts/v20190823"
)

// // 音频合成
// func TextToSpeech(text string, sessionid string) (*tts.TextToVoiceResponse, error) {
// 	credential := common.NewCredential(
// 		global.GVA_CONFIG.App.SecretID,
// 		global.GVA_CONFIG.App.SecretKey,
// 	)
// 	// 实例化一个client选项，可选的，没有特殊需求可以跳过
// 	cpf := profile.NewClientProfile()
// 	cpf.HttpProfile.Endpoint = global.GVA_CONFIG.Service.Speech.TTS
// 	// 实例化要请求产品的client对象,clientProfile是可选的
// 	client, _ := tts.NewClient(credential, "ap-beijing", cpf)

// 	// 实例化一个请求对象,每个接口都会对应一个request对象
// 	request := tts.NewTextToVoiceRequest()

// 	request.Text = common.StringPtr(text)
// 	request.SessionId = common.StringPtr(sessionid)

// 	// 返回的resp是一个TextToVoiceResponse的实例，与请求对象对应
// 	response, err := client.TextToVoice(request)
// 	if _, ok := err.(*errors.TencentCloudSDKError); ok {
// 		log.Printf("An API error has returned: %s", err)
// 		return response, err
// 	}
// 	if err != nil {
// 		panic(err)
// 	}

// 	// 输出json格式的字符串回包
// 	// 打印调试
// 	// log.Printf("%s", response.ToJsonString())

// 	return response, nil
// }
// 创建认证凭证
func createCredential(secretID, secretKey string) *common.Credential {
    return common.NewCredential(secretID, secretKey)
}

// 创建客户端配置
func createClientProfile(endpoint string) *profile.ClientProfile {
    clientProfile := profile.NewClientProfile()
    clientProfile.HttpProfile.Endpoint = endpoint
    return clientProfile
}

// 实例化 TTS 客户端
func createTTSClient(credential *common.Credential, region string, clientProfile *profile.ClientProfile) (*tts.Client, error) {
    return tts.NewClient(credential, region, clientProfile)
}

// 创建请求对象
func createTextToVoiceRequest(text, sessionID string) *tts.TextToVoiceRequest {
    request := tts.NewTextToVoiceRequest()
    request.Text = common.StringPtr(text)
    request.SessionId = common.StringPtr(sessionID)
    return request
}

// 发送请求并获取响应
func sendTextToVoiceRequest(client *tts.Client, request *tts.TextToVoiceRequest) (*tts.TextToVoiceResponse, error) {
    response, err := client.TextToVoice(request)
    if err != nil {
        if sdkErr, ok := err.(*errors.TencentCloudSDKError); ok {
            log.Printf("Tencent Cloud SDK error: %s", sdkErr)
            return nil, sdkErr
        }
        return nil, fmt.Errorf("failed to call TextToVoice API: %w", err)
    }
    return response, nil
}

// 音频合成主函数
func TextToSpeech(text, sessionID string) (*tts.TextToVoiceResponse, error) {
    credential := createCredential(global.GVA_CONFIG.App.SecretID, global.GVA_CONFIG.App.SecretKey)
    clientProfile := createClientProfile(global.GVA_CONFIG.Service.Speech.TTS)
    
    client, err := createTTSClient(credential, "ap-beijing", clientProfile)
    if err != nil {
        return nil, fmt.Errorf("failed to create TTS client: %w", err)
    }

    request := createTextToVoiceRequest(text, sessionID)
    response, err := sendTextToVoiceRequest(client, request)
    if err != nil {
        return nil, err
    }

    return response, nil
}

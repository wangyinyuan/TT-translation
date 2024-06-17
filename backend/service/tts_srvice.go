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

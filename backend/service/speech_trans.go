package service

import (
	"encoding/base64"
	"fmt"
	"os"
	"src/global"

	asr "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/asr/v20190614"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
)

// convertAudioToBase64 将音频文件转换为Base64编码的字符串
func convertAudioToBase64(filePath string) (string, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(data), nil
}
func organizeRequest(filepath string) (uint64, error) {
	// todo : 秘钥处理，不能直接放代码里
	credential := common.NewCredential(
		global.GVA_CONFIG.App.SecretID,
		global.GVA_CONFIG.App.SecretKey,
	)
	// 实例化一个client选项，可选的，没有特殊需求可以跳过
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "asr.tencentcloudapi.com"
	// 实例化要请求产品的client对象,clientProfile是可选的
	client, _ := asr.NewClient(credential, "", cpf)

	// 实例化一个请求对象,每个接口都会对应一个request对象
	request := asr.NewCreateRecTaskRequest()

	request.EngineModelType = common.StringPtr("16k_zh")
	request.ChannelNum = common.Uint64Ptr(1)
	request.ResTextFormat = common.Uint64Ptr(2)
	request.SourceType = common.Uint64Ptr(1)

	base64Audio, err := convertAudioToBase64(filepath)
	if err != nil {
		fmt.Printf("Error converting audio to Base64: %v\n", err)
		return 0, err
	}
	// 打印 Base64 编码字符串的前 100 个字符，用于验证
	fmt.Println(string(base64Audio[:100]))
	request.Data = common.StringPtr(base64Audio)

	// 返回的resp是一个CreateRecTaskResponse的实例，与请求对象对应
	response, err := client.CreateRecTask(request)
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return 0, err
	}
	if err != nil {
		panic(err)
	}
	// 输出json格式的字符串回包
	fmt.Printf("%s", response.ToJsonString())
	return *response.Response.Data.TaskId, nil
}

func organizeQuery(taskid uint64) (asr.DescribeTaskStatusResponse, error) {

	// todo : 秘钥处理，不能直接放代码里
	credential := common.NewCredential(
		global.GVA_CONFIG.App.SecretID,
		global.GVA_CONFIG.App.SecretKey,
	)

	// 实例化一个client选项，可选的，没有特殊需求可以跳过
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "asr.tencentcloudapi.com"
	// 实例化要请求产品的client对象,clientProfile是可选的
	client, _ := asr.NewClient(credential, "", cpf)

	// 实例化一个请求对象,每个接口都会对应一个request对象
	request := asr.NewDescribeTaskStatusRequest()

	request.TaskId = common.Uint64Ptr(taskid)

	// 返回的resp是一个DescribeTaskStatusResponse的实例，与请求对象对应
	response, err := client.DescribeTaskStatus(request)
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return *response, err
	}
	if err != nil {
		fmt.Printf("err: %s", err)
		return *response, err
	}
	// 输出json格式的字符串回包
	fmt.Printf("%s", response.ToJsonString())
	return *response, nil
}

// func OrganizeSpeech(file io.Reader) (string, error) {
// 	// todo 在这里实现语音识别的逻辑
// 	// 返回识别结果和可能的错误
// 	return "", nil
// }

func OrganizeSpeech(filepath string) (asr.DescribeTaskStatusResponse, error) {
	// todo 在这里实现语音识别的逻辑
	taskid, err := organizeRequest(filepath)
	if err != nil {
		fmt.Printf("err in organizeRequest: %s", err)
	}
	response, err2 := organizeQuery(taskid)
	if err2 != nil {
		fmt.Printf("err in organizeQuery: %s", err)
	}
	// 返回识别结果和可能的错误
	return response, nil
}

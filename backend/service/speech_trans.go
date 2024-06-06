package service

import (
	// "encoding/json"
	"fmt"
	"time"

	"encoding/base64"
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
	// fmt.Printf("%s", response.ToJsonString())
	return *response.Response.Data.TaskId, nil
}

func organizeQuery(taskid uint64) (asr.DescribeTaskStatusResponse, error) {

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
	// 打印调试
	// fmt.Printf("%s", response.ToJsonString())
	return *response, nil
}

// 轮询
func pollingRecognitionResult(taskID uint64, resultChan chan<- asr.DescribeTaskStatusResponse, errChan chan<- error) {

	go func() {
		interval := 1 * time.Second // 设置轮询间隔
		for {
			resp, err := organizeQuery(taskID)
			if err != nil {
				fmt.Println("[Error] query:", err)
				// time.Sleep(interval)
				errChan <- err
				return
			}
			fmt.Printf("Task %d status: %d - %s\n", taskID, *resp.Response.Data.Status, *resp.Response.Data.Result)

			if *resp.Response.Data.Status == 2 {
				fmt.Println("Task finished with status:success")
				resultChan <- resp
				break // 退出轮询
			}
			if *resp.Response.Data.Status == 3 {
				fmt.Printf("Task finished with status:failed \nerror message:%s", *resp.Response.Data.ErrorMsg)
				resultChan <- resp
				break
			}
			time.Sleep(interval) // 等待后重试
		}
	}()

	// 阻塞主goroutine，防止程序立即退出
	select {}
}

func OrganizeSpeech(filepath string) (asr.DescribeTaskStatusResponse, error) {
	// 申请识别
	taskid, err := organizeRequest(filepath)
	if err != nil {
		fmt.Printf("err in organizeRequest: %s", err)
		return asr.DescribeTaskStatusResponse{}, err
	}

	// 轮询结果

	resultChan := make(chan asr.DescribeTaskStatusResponse)
	errChan := make(chan error)

	// 启动轮询goroutine
	go pollingRecognitionResult(taskid, resultChan, errChan)

	// 等待结果或错误
	select {
	case result := <-resultChan:
		// 处理成功的结果
		fmt.Println("Received result:", result)
		return result, nil
	case err := <-errChan:
		// 处理错误
		fmt.Println("Received error:", err)
		return asr.DescribeTaskStatusResponse{}, err
	}
}

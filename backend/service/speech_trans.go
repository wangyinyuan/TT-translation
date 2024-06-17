package service

import (
	"log"
	"time"

	"encoding/base64"
	"os"
	"src/global"

	asr "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/asr/v20190614"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
)

// // 将音频文件转换为Base64编码的字符串
// func convertAudioToBase64(filePath string) (string, error) {
// 	data, err := os.ReadFile(filePath)
// 	if err != nil {
// 		return "", err
// 	}
// 	return base64.StdEncoding.EncodeToString(data), nil
// }

// // 发送语音识别请求
// func organizeRequest(filepath string) (uint64, error) {
// 	credential := common.NewCredential(
// 		global.GVA_CONFIG.App.SecretID,
// 		global.GVA_CONFIG.App.SecretKey,
// 	)
// 	// 实例化一个client选项，可选的，没有特殊需求可以跳过
// 	cpf := profile.NewClientProfile()
// 	cpf.HttpProfile.Endpoint = global.GVA_CONFIG.Service.Speech.ASR
// 	// 实例化要请求产品的client对象,clientProfile是可选的
// 	client, _ := asr.NewClient(credential, "", cpf)

// 	// 实例化一个请求对象,每个接口都会对应一个request对象
// 	request := asr.NewCreateRecTaskRequest()

// 	request.EngineModelType = common.StringPtr("16k_zh")
// 	request.ChannelNum = common.Uint64Ptr(1)
// 	request.ResTextFormat = common.Uint64Ptr(2)
// 	request.SourceType = common.Uint64Ptr(1)

// 	base64Audio, err := convertAudioToBase64(filepath)
// 	if err != nil {
// 		log.Printf("Error converting audio to Base64: %v\n", err)
// 		return 0, err
// 	}

// 	// 打印 Base64 编码字符串的前 100 个字符，用于验证
// 	// log.Println(string(base64Audio[:100]))

// 	request.Data = common.StringPtr(base64Audio)

// 	// 返回的resp是一个CreateRecTaskResponse的实例，与请求对象对应
// 	response, err := client.CreateRecTask(request)
// 	if _, ok := err.(*errors.TencentCloudSDKError); ok {
// 		log.Printf("An API error has returned: %s", err)
// 		return 0, err
// 	}
// 	if err != nil {
// 		panic(err)
// 	}

// 	// 输出json格式的字符串回包
// 	// log.Printf("%s", response.ToJsonString())

// 	return *response.Response.Data.TaskId, nil
// }

// // 单次查询语音识别结果
// func organizeQuery(taskid uint64) (asr.DescribeTaskStatusResponse, error) {

// 	credential := common.NewCredential(
// 		global.GVA_CONFIG.App.SecretID,
// 		global.GVA_CONFIG.App.SecretKey,
// 	)

// 	// 实例化一个client选项，可选的，没有特殊需求可以跳过
// 	cpf := profile.NewClientProfile()
// 	cpf.HttpProfile.Endpoint = global.GVA_CONFIG.Service.Speech.ASR
// 	// 实例化要请求产品的client对象,clientProfile是可选的
// 	client, _ := asr.NewClient(credential, "", cpf)

// 	// 实例化一个请求对象,每个接口都会对应一个request对象
// 	request := asr.NewDescribeTaskStatusRequest()

// 	request.TaskId = common.Uint64Ptr(taskid)

// 	// 返回的resp是一个DescribeTaskStatusResponse的实例，与请求对象对应
// 	response, err := client.DescribeTaskStatus(request)
// 	if _, ok := err.(*errors.TencentCloudSDKError); ok {
// 		log.Printf("An API error has returned: %s", err)
// 		return *response, err
// 	}
// 	if err != nil {
// 		log.Printf("err: %s", err)
// 		return *response, err
// 	}

// 	// 输出json格式的字符串回包
// 	// 打印调试
// 	// log.Printf("%s", response.ToJsonString())

// 	return *response, nil
// }

// // 轮询语音识别结果
// func pollingRecognitionResult(taskID uint64, resultChan chan<- asr.DescribeTaskStatusResponse, errChan chan<- error) {

// 	go func() {
// 		interval := 1 * time.Second // 设置轮询间隔
// 		for {
// 			resp, err := organizeQuery(taskID)
// 			if err != nil {
// 				log.Println("[Error] query:", err)
// 				// time.Sleep(interval)
// 				errChan <- err
// 				return
// 			}
// 			log.Printf("Task %d status: %d - %s", taskID, *resp.Response.Data.Status, *resp.Response.Data.Result)

// 			if *resp.Response.Data.Status == 2 {
// 				log.Println("Task finished with status:success")
// 				resultChan <- resp
// 				break // 退出轮询
// 			}
// 			if *resp.Response.Data.Status == 3 {
// 				log.Printf("Task finished with status:failed \nerror message:%s", *resp.Response.Data.ErrorMsg)
// 				resultChan <- resp
// 				break
// 			}
// 			time.Sleep(interval) // 等待后重试
// 		}
// 	}()

// 	// 阻塞主goroutine，防止程序立即退出
// 	select {}
// }

// // 语音识别
// func OrganizeSpeech(filepath string) (asr.DescribeTaskStatusResponse, error) {
// 	// 申请识别
// 	taskid, err := organizeRequest(filepath)
// 	if err != nil {
// 		log.Printf("err in organizeRequest: %s", err)
// 		return asr.DescribeTaskStatusResponse{}, err
// 	}

// 	// 轮询结果
// 	resultChan := make(chan asr.DescribeTaskStatusResponse)
// 	errChan := make(chan error)

// 	// 启动轮询goroutine
// 	go pollingRecognitionResult(taskid, resultChan, errChan)

// 	// 等待结果或错误
// 	select {
// 	case result := <-resultChan:
// 		// 处理成功的结果
// 		log.Println("Received result:", result)
// 		return result, nil
// 	case err := <-errChan:
// 		// 处理错误
// 		log.Println("Received error:", err)
// 		return asr.DescribeTaskStatusResponse{}, err
// 	}
// }

func convertAudioToBase64(filePath string) (string, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(data), nil
}

func createASRClient() (*asr.Client, error) {
	credential := common.NewCredential(
		global.GVA_CONFIG.App.SecretID,
		global.GVA_CONFIG.App.SecretKey,
	)
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = global.GVA_CONFIG.Service.Speech.ASR
	return asr.NewClient(credential, "", cpf)
}

func createRecTaskRequest(filePath string) (*asr.CreateRecTaskRequest, error) {
	base64Audio, err := convertAudioToBase64(filePath)
	if err != nil {
		return nil, err
	}

	request := asr.NewCreateRecTaskRequest()
	request.EngineModelType = common.StringPtr("16k_zh")
	request.ChannelNum = common.Uint64Ptr(1)
	request.ResTextFormat = common.Uint64Ptr(2)
	request.SourceType = common.Uint64Ptr(1)
	request.Data = common.StringPtr(base64Audio)
	return request, nil
}

func organizeRequest(filePath string) (uint64, error) {
	client, err := createASRClient()
	if err != nil {
		return 0, err
	}

	request, err := createRecTaskRequest(filePath)
	if err != nil {
		return 0, err
	}

	response, err := client.CreateRecTask(request)
	if err != nil {
		if _, ok := err.(*errors.TencentCloudSDKError); ok {
			log.Printf("An API error has returned: %s", err)
		}
		return 0, err
	}

	return *response.Response.Data.TaskId, nil
}

func createTaskStatusRequest(taskID uint64) *asr.DescribeTaskStatusRequest {
	request := asr.NewDescribeTaskStatusRequest()
	request.TaskId = common.Uint64Ptr(taskID)
	return request
}

func organizeQuery(taskID uint64) (asr.DescribeTaskStatusResponse, error) {
	client, err := createASRClient()
	if err != nil {
		return asr.DescribeTaskStatusResponse{}, err
	}

	request := createTaskStatusRequest(taskID)
	response, err := client.DescribeTaskStatus(request)
	if err != nil {
		if _, ok := err.(*errors.TencentCloudSDKError); ok {
			log.Printf("An API error has returned: %s", err)
		}
		return asr.DescribeTaskStatusResponse{}, err
	}

	return *response, nil
}

func pollingRecognitionResult(taskID uint64, resultChan chan<- asr.DescribeTaskStatusResponse, errChan chan<- error) {
	go func() {
		interval := 1 * time.Second
		for {
			resp, err := organizeQuery(taskID)
			if err != nil {
				log.Println("[Error] query:", err)
				errChan <- err
				return
			}

			status := *resp.Response.Data.Status
			log.Printf("Task %d status: %d - %s", taskID, status, *resp.Response.Data.Result)

			if status == 2 {
				log.Println("Task finished with status: success")
				resultChan <- resp
				break
			}
			if status == 3 {
				log.Printf("Task finished with status: failed\nError message: %s", *resp.Response.Data.ErrorMsg)
				resultChan <- resp
				break
			}
			time.Sleep(interval)
		}
	}()

	select {}
}

func OrganizeSpeech(filePath string) (asr.DescribeTaskStatusResponse, error) {
	taskID, err := organizeRequest(filePath)
	if err != nil {
		log.Printf("Error in organizeRequest: %s", err)
		return asr.DescribeTaskStatusResponse{}, err
	}

	resultChan := make(chan asr.DescribeTaskStatusResponse)
	errChan := make(chan error)

	go pollingRecognitionResult(taskID, resultChan, errChan)

	select {
	case result := <-resultChan:
		log.Println("Received result:", result)
		return result, nil
	case err := <-errChan:
		log.Println("Received error:", err)
		return asr.DescribeTaskStatusResponse{}, err
	}
}

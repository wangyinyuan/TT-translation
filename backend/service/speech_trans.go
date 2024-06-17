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

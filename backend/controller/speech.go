package controller

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"src/model"

	"src/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func SpeechTranslateHandler(c *gin.Context) {
	// 解析前端发送过来的音频文件
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	defer file.Close()

	// 生成UUID作为文件名
	fileName := uuid.New().String() + filepath.Ext(fileHeader.Filename)

	// 创建文件用于存储上传的文件
	filePath := "./uploads/" + fileName // 这里是临时存储目录，你需要提前创建它
	f, err := os.Create(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	defer func() {
		// 确保在函数返回前删除临时文件
		if err := os.Remove(filePath); err != nil {
			fmt.Printf("Error removing temporary file %s: %v\n", filePath, err)
		}
	}()

	// 将文件内容写入到临时文件中
	_, err = io.Copy(f, file)
	if err != nil {
		fmt.Println(err)
		os.Remove(filePath) // 删除文件，如果写入失败
		return
	}

	// 调用语音识别的服务
	organizeResponse, err := service.OrganizeSpeech(filePath)
	result := *organizeResponse.Response.Data.Result
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recognize speech"})
		return
	}

	// 解析前端发送过来的 JSON 数据
	var req model.TranslateRequest
	req.Text = result
	req.TargetLang = c.PostForm("target_language")
	req.SourceLang = c.PostForm("source_language")

	// 调用 service 层的 Translate 方法进行翻译
	translation, err := service.Translate(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to translate"})
		return
	}

	// todo 暂时将合成朗读音频的链接设为空字符串
	audioURL := ""

	// 构建返回给前端的结构体
	response := model.SpeechTranslationResponse{
		RecognitionResult: result,
		TranslationResult: translation,
		AudioURL:          audioURL,
	}

	// 将结果返回给前端
	c.JSON(http.StatusOK, response)
}

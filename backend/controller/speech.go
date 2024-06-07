package controller

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"src/model"
	"src/service"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func removeBracketsAndContents(input string) string {
	// 匹配 [ 开始的任何内容直到 ]
	re := regexp.MustCompile(`\[[^\]]*\]`)
	// 使用空字符串替换匹配到的部分
	return re.ReplaceAllString(input, "")
}
func SpeechTranslateHandler(c *gin.Context) {
	// 解析前端发送过来的音频文件
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		log.Println("Error Retrieving the File")
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	defer file.Close()

	// 生成UUID作为文件名
	fileName := uuid.New().String() + filepath.Ext(fileHeader.Filename)

	// 定义uploads目录和文件路径
	uploadsDir := "./uploads/"
	filePath := filepath.Join(uploadsDir, fileName) // 使用filepath.Join来构建文件路径

	// 检查uploads目录是否存在
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		// 创建uploads目录
		err = os.MkdirAll(uploadsDir, 0755) // 使用0755作为目录权限
		if err != nil {
			log.Println("创建uploads目录失败:", err)
			return
		}
	}

	// 创建文件用于存储上传的文件
	f, err := os.Create(filePath)
	if err != nil {
		log.Println(err)
		return
	}

	defer func() {
		// 确保在函数返回前删除临时文件
		if err := os.Remove(filePath); err != nil {
			log.Printf("Error removing temporary file %s: %v\n", filePath, err)
		}
	}()

	defer f.Close()
	// 将文件内容写入到临时文件中
	_, err = io.Copy(f, file)
	if err != nil {
		log.Println(err)
		os.Remove(filePath) // 删除文件，如果写入失败
		return
	}

	// 调用语音识别的服务
	organizeResponse, err := service.OrganizeSpeech(filePath)
	result := *organizeResponse.Response.Data.Result
	// 去掉 [] 和它们的内容
	result = removeBracketsAndContents(result)
	// 再去掉字符串两端的空格
	result = strings.TrimSpace(result)
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

	// 调用 sevice 层的 TextToSpeech 方法合成原始语言和目标语言的文本音频
	speechResult1, err1 := service.TextToSpeech(req.Text, uuid.New().String())
	if err1 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get source text speech"})
		return
	}

	speechResult2, err2 := service.TextToSpeech(translation, uuid.New().String())
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get translation speech"})
		return
	}

	audio1 := speechResult1.Response.Audio
	audio2 := speechResult2.Response.Audio

	sourceSpeechResponse := model.TTSResponce{
		Audio: *audio1,
	}
	targetSpeechResponse := model.TTSResponce{
		Audio: *audio2,
	}

	// 构建返回给前端的结构体
	response := model.SpeechTranslationResponse{
		RecognitionResult:    result,
		TranslationResult:    translation,
		SourceSpeechResponse: sourceSpeechResponse,
		TargetSpeechResponse: targetSpeechResponse,
	}

	// 将结果返回给前端
	c.JSON(http.StatusOK, response)
}

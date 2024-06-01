package service

// import (
// 	"os"

// 	"github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
// )

// // TextToSpeech generates speech from text and returns the audio data
// func TextToSpeech(text, language string) ([]byte, error) {
// 	// Initialize Whisper TTS engine
// 	model, err := whisper.New()
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Generate a unique temporary file
// 	tempFile, err := os.CreateTemp("", "speech-*.wav")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer os.Remove(tempFile.Name())

// 	// Convert text to speech and save to the temporary file
// 	err = model.TextToSpeech(text, tempFile.Name())
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Close the file so we can read it
// 	tempFile.Close()

// 	// Read the generated file
// 	audioData, err := os.ReadFile(tempFile.Name())
// 	if err != nil {
// 		return nil, err
// 	}

// 	return audioData, nil
// }

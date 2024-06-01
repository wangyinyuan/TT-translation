package service

// import (
// 	"os"

// 	htgotts "github.com/hegedustibor/htgo-tts"
// )

// // TextToSpeech generates speech from text and returns the audio data
// func TextToSpeech(text, language string) ([]byte, error) {
// 	// Create a new speech instance with specified language
// 	speech := htgotts.Speech{Folder: "audio", Language: language}

// 	// Generate a unique temporary file
// 	tempFile, err := os.CreateTemp("", "speech-*.mp3")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer os.Remove(tempFile.Name())

// 	// Save the speech to the temporary file
// 	err = speech.Speak(text)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Read the generated file
// 	audioData, err := os.ReadFile(tempFile.Name())
// 	if err != nil {
// 		return nil, err
// 	}

// 	return audioData, nil
// }

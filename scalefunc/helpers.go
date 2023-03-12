/*
	Copyright 2022 Loophole Labs

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		   http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

package scalefunc

import "os"

// Read opens a file at the given path and returns a *ScaleFile
func Read(path string) (*ScaleFunc, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	scaleFunc := new(ScaleFunc)
	return scaleFunc, scaleFunc.Decode(data)
}

// Write opens a file at the given path and writes the given scalefile to it
func Write(path string, scaleFunc *ScaleFunc) error {
	data := scaleFunc.Encode()
	return os.WriteFile(path, data, 0644)
}

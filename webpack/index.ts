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

module.exports = function (buffer: Buffer) {
    let out = "const scale = require('@loopholelabs/scale');";
    out += "const scaleFunc = require('@loopholelabs/scalefile/scalefunc');";
    out += "let buffer = new ArrayBuffer(" + buffer.length + ");";
    out += "let uint8Buffer = new Uint8Array(buffer);";
    out += "uint8Buffer.set([";
    for(let i = 0; i < buffer.length; i++) {
        out += buffer[i] + ","
    }
    out += "]);"
    out += "module.exports = scaleFunc.ScaleFunc.Decode(uint8Buffer);"
    // @ts-ignore
    this.callback(null, out);
}
module.exports.raw = true

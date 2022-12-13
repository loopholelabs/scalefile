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

export type Version = string;
export type Language = string;

export class Extension {
  Name: undefined | string;
  Version: undefined | string;
}

export class ScaleFunc {
  Version: undefined | Version;
  Name: undefined | string;
  Signature: undefined | string;
  Language: undefined | Language;
  Extensions: undefined | Extension[];
  Function: undefined | Buffer;
  Size: undefined | number;
  Checksum: undefined | string;
}

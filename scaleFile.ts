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

import { parse, stringify } from 'yaml'

import fs from "fs";

import { VersionErr, LanguageErr, Version, V1Alpha,
  Language, Go, Rust, TypeScript,
  AcceptedVersions, AcceptedLanguages,
  Extension, Dependency
 } from "./scalefunc/scaleFunc";

// Package scalefile implements the ScaleFile type, as well as any helper functions
// for interacting with ScaleFile types

export class ScaleFile {
  public Version: Version           // json/yaml: version
  public Name: string               // json/yaml: name
  public Signature: string          // json/yaml: signature
  public Language: Language         // json/yaml: language
  public Dependencies: Dependency[] // json/yaml: dependencies
  public Extensions: Extension[]    // json/yaml: extensions
  public Source: string             // json/yaml: source

  public constructor() {
    this.Version = V1Alpha;
    this.Name = "";
    this.Signature = "";
    this.Language = TypeScript;
    this.Dependencies = [];
    this.Extensions = [];
    this.Source = "";
  }

  public static Read(path: string): ScaleFile {
    let data = fs.readFileSync(path, 'utf8');
    return ScaleFile.Decode(data);
  }

  public static Write(path: string, scaleFile: ScaleFile) {
    let data = scaleFile.Encode()
    fs.writeFileSync(path, data);
  }

  public static Decode(data: string): ScaleFile {
    // Load the yaml file
    const doc = parse(data);

    var sf = new ScaleFile();
    // TODO: Convert it into a scaleFile, and verify things...

    if (!AcceptedVersions.includes(sf.Version)) throw VersionErr;

    if (!AcceptedLanguages.includes(sf.Language)) throw LanguageErr;

    return sf;
  }

  public Encode(): string {
    if (!AcceptedVersions.includes(this.Version)) throw VersionErr;

    if (!AcceptedLanguages.includes(this.Language)) throw LanguageErr;

    // TODO: Options
    var data = stringify(this);

    return data;
  }
}

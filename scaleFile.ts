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

import fs from "fs";

import { load, dump } from "js-yaml";

import {
  VersionErr,
  LanguageErr,
  Language,
  Go,
  AcceptedLanguages
 } from "./scalefunc";

export type Version = string;

// V1Alpha is the V1 Alpha definition of a ScaleFunc
export const V1Alpha: Version = "v1alpha";

// AcceptedVersions is an array of acceptable Versions
export const AcceptedVersions: Version[] = [V1Alpha];

export class Dependency {
  public Name: string;
  public Version: string;
  
  constructor(name: string, version: string) {
    this.Name = name;
    this.Version = version;
  }
}

export class ScaleFile {
  public Version: Version           // json/yaml: version
  public Name: string               // json/yaml: name
  public Signature: string          // json/yaml: signature
  public Language: Language         // json/yaml: language
  public Dependencies: Dependency[] // json/yaml: dependencies
  public Source: string             // json/yaml: source

  public constructor() {
    this.Version = V1Alpha;
    this.Name = "";
    this.Signature = "";
    this.Language = Go;
    this.Dependencies = [];
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
    const doc: any = load(data);

    let sf = new ScaleFile();
    sf.Version = doc.version as Version;
    sf.Name = doc.name;
    sf.Signature = doc.signature;
    sf.Language = doc.language as Language;
    sf.Source = doc.source;

    sf.Dependencies = [];
    for(let d of doc.dependencies) {
      sf.Dependencies.push(new Dependency(d.name, d.version));
    }

    if (!AcceptedVersions.includes(sf.Version)) throw VersionErr;

    if (!AcceptedLanguages.includes(sf.Language)) throw LanguageErr;

    return sf;
  }

  public Encode(): string {
    if (!AcceptedVersions.includes(this.Version)) throw VersionErr;

    if (!AcceptedLanguages.includes(this.Language)) throw LanguageErr;

    let deps = [];
    for(let e of this.Dependencies) {
      deps.push({name: e.Name, version: e.Version});
    }

    return dump({
      version: this.Version,
      language: this.Language,
      name: this.Name,
      signature: this.Signature,
      source: this.Source,
      dependencies: deps
    });
  }
}

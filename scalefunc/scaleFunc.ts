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

import sha256 from "fast-sha256";

import {
  encodeString,
  decodeString,
  encodeUint32,
  decodeUint32,
  encodeUint8Array,
  decodeUint8Array,
} from "@loopholelabs/polyglot-ts";
import fs from "fs";

const InvalidNameRegex = /[^A-Za-z0-9_]/;

export const VersionErr = new Error("unknown or invalid version");
export const LanguageErr = new Error("unknown or invalid language");
export const ChecksumErr = new Error("error while verifying checksum");

export type Version = string;

// V1Alpha is the V1 Alpha definition of a ScaleFunc
export const V1Alpha: Version = "v1alpha";

export type Language = string;

// Go is the Golang Source Language for Scale Functions
export const Go: Language = "go";

// Rust is the Rust Source Language for Scale Functions
export const Rust: Language = "rust";

// AcceptedVersions is an array of acceptable Versions
export const AcceptedVersions: Version[] = [V1Alpha];

// AcceptedLanguages is an array of acceptable Languages
export const AcceptedLanguages: Language[] = [Go, Rust];

export class ScaleFunc {
  public Version: Version;
  public Name: string;
  public Tag: string;
  public Signature: string;
  public Language: Language;
  public Function: Buffer;
  public Size: undefined | number;
  public Checksum: undefined | string;

  constructor(
    version: Version,
    name: string,
    tag: string,
    signature: string,
    language: string,
    fn: Buffer
  ) {
    this.Version = version;
    this.Name = name;
    this.Tag = tag;
    this.Signature = signature;
    this.Language = language;
    this.Function = fn;
  }

  Encode(): Uint8Array {
    let b = encodeString(new Uint8Array(), this.Version as string);
    b = encodeString(b, this.Name);
    b = encodeString(b, this.Tag);
    b = encodeString(b, this.Signature);
    b = encodeString(b, this.Language as string);
    b = encodeUint8Array(b, this.Function);

    // Compute the hash (sha256)

    const size = b.length;
    const hashed = sha256(b);
    let hex = Buffer.from(hashed).toString("hex");

    b = encodeUint32(b, size);
    b = encodeString(b, hex);
    return b;
  }

  static Decode(data: Uint8Array): ScaleFunc {
    let b: Uint8Array = data;
    let versionString: string;
    ({ value: versionString, buf: b } = decodeString(b));
    const version = versionString as Version;
    if (!AcceptedVersions.includes(version)) throw VersionErr;

    let name: string;
    ({ value: name, buf: b } = decodeString(b));

    let tag: string;
    ({ value: tag, buf: b } = decodeString(b));

    let signature: string;
    ({ value: signature, buf: b } = decodeString(b));

    let language: string;
    ({ value: language, buf: b } = decodeString(b));
    if (!AcceptedLanguages.includes(language)) throw LanguageErr;

    let fn: Uint8Array;
    ({ value: fn, buf: b } = decodeUint8Array(b));

    let size: number;
    ({ value: size, buf: b } = decodeUint32(b));

    let hash: string;
    ({ value: hash } = decodeString(b));

    const hashed = sha256(data.slice(0, size));
    let hex = Buffer.from(hashed).toString("hex");

    if (hex !== hash) throw ChecksumErr;

    const sf = new ScaleFunc(
      version,
      name,
      tag,
      signature,
      language,
      Buffer.from(fn)
    );
    sf.Size = size;
    sf.Checksum = hash;
    return sf;
  }

  static ValidName(name: string): boolean {
    return !InvalidNameRegex.test(name);
  }

  public static Read(path: string): ScaleFunc {
    let data = fs.readFileSync(path, null);
    return ScaleFunc.Decode(data);
  }

  public static Write(path: string, scaleFunc: ScaleFunc) {
    let data = scaleFunc.Encode()
    fs.writeFileSync(path, data);
  }
}

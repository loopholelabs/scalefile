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

import { TextEncoder, TextDecoder } from "util";

import { ScaleFunc, Go, VersionErr, LanguageErr, ChecksumErr, V1Alpha, Extension } from "./scaleFunc";

window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder as typeof window["TextDecoder"];

describe("scaleFunc", () => {
  var enc = new TextEncoder(); // always utf-8

  const someFunction = enc.encode("Hello world some function here");

  it("Can encode and decode", () => {

    expect(() => {
      const sfInvalid = new ScaleFunc("invalid", "name", "signature", Go, [], Buffer.from(someFunction));
      const b = sfInvalid.Encode();
      const sf = ScaleFunc.Decode(b);
    }).toThrow(VersionErr);

    expect(() => {
      const sfInvalid = new ScaleFunc(V1Alpha, "name", "signature", "invalid", [], Buffer.from(someFunction));
      const b = sfInvalid.Encode();
      const sf = ScaleFunc.Decode(b);
    }).toThrow(LanguageErr);

    const extensions = [new Extension("Test Extension", "1.0.0")];
    const sf = new ScaleFunc(V1Alpha, "Test name", "Test Signature", Go, extensions, Buffer.from(someFunction));

    const buff = sf.Encode();
    const sf2 = ScaleFunc.Decode(buff);

    expect(sf.Version).toBe(sf2.Version);
    expect(sf.Name).toBe(sf2.Name);
    expect(sf.Signature).toBe(sf2.Signature);
    expect(sf.Language).toBe(sf2.Language);
    expect(sf.Extensions).toStrictEqual(sf2.Extensions);
    expect(sf.Function).toStrictEqual(sf2.Function);
  
    if (sf2.Size!==undefined && sf2.Checksum!==undefined) {
      buff[buff.length - 1]++;  // This increments the last byte of the hash
      // Now try decode again with a bad checksum...
      expect(() => {
        const sf3 = ScaleFunc.Decode(buff);
      }).toThrow(ChecksumErr);
    } else {
      throw new Error("Size or Checksum were not set!");
    }
  });
});
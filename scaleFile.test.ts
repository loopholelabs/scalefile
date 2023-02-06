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

import { ScaleFile, Dependency } from "./scaleFile";

describe("scaleFile", () => {
  it("Can encode and decode", () => {
    // Check we can encode and decode scaleFile
    let sf = new ScaleFile();
    sf.Signature = "test.signature";
    sf.Name = "test.name";
    sf.Dependencies.push(new Dependency("test.dep.name", "test.dep.version"));

    // Encode it...
    let data = sf.Encode();

    let sf2 = ScaleFile.Decode(data);

    expect(sf2.Name).toBe(sf.Name);
    expect(sf2.Signature).toBe(sf.Signature);
    expect(sf2.Version).toBe(sf.Version);
    expect(sf2.Language).toBe(sf.Language);

    expect(sf2.Dependencies).toStrictEqual(sf.Dependencies);
    
  });
});
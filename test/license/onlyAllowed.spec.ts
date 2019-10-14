import test, { after } from "ava";
import * as sinon from "sinon";

import { onlyAllow } from "../../src/license";
import { Package } from "../../src/interfaces";

after(() => {
    sinon.restore();
});

test("No licenses to check", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "MIT" },
        { name: "test-02", license: "Apache-2.0" },
        { name: "test-03", license: "ISC" }
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: undefined });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 0);
});

test("All packages allowed, single check", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "MIT" },
        { name: "test-02", license: "MIT" },
        { name: "test-03", license: "MIT" }
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["MIT"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 0);
});

test("All packages allowed, multiple checks", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "MIT" },
        { name: "test-02", license: "Apache-2.0" },
        { name: "test-03", license: "ISC" }
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["Apache-2.0", "ISC", "MIT"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 0);
});

test("Some packages not allowed, single check", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "MIT" },
        { name: "test-02", license: "Apache-2.0" },
        { name: "test-03", license: "ISC" },
        { name: "test-04", license: "BSD-2-Clause" }
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["ISC"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 3);
    t.is(invalid[0].name, "test-01");
    t.is(invalid[1].name, "test-02");
    t.is(invalid[2].name, "test-04");
});

test("Some packages not allowed, multiple checks", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "MIT" },
        { name: "test-02", license: "Apache-2.0" },
        { name: "test-03", license: "ISC" },
        { name: "test-04", license: "BSD-2-Clause" }
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["MIT", "ISC"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 2);
    t.is(invalid[0].name, "test-02");
    t.is(invalid[1].name, "test-04");
});

test("All packages allowed, OR licenses", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "(MIT OR Apache-2.0)" },
        { name: "test-02", license: "(BSD-2-Clause OR MIT)" },
        { name: "test-03", license: "(MIT OR BSD-2-Clause OR Apache-2.0)" },
        { name: "test-04", license: "ISC" },
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["MIT", "ISC"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 0);
});

test("Some packages not allowed, OR licenses", (t) => {
    const packages: Array<Package> = [
        { name: "test-01", license: "(MIT OR Apache-2.0)" },
        { name: "test-02", license: "(BSD-2-Clause OR MIT)" },
        { name: "test-03", license: "(MIT OR BSD-2-Clause OR Apache-2.0)" },
        { name: "test-04", license: "ISC" },
    ];

    // Arguments
    sinon.stub(require("../../src/program"), "args").value({ allow: ["MIT", "BSD-3-Clause"] });

    const invalid = onlyAllow(packages);

    t.is(invalid.length, 1);
    t.is(invalid[0].name, "test-04");
});
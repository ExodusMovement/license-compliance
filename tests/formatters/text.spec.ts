import test from "ava";
import chalk from "chalk";
import * as sinon from "sinon";

import { Literals } from "../../src/enumerations";
import { Text } from "../../src/formatters/text";
import { Package } from "../../src/interfaces";

let stubConsole: sinon.SinonStub;

test.beforeEach((): void => {
    stubConsole = sinon.stub(console, "info");
});

test.afterEach((): void => {
    sinon.restore();
});

test.serial("Detail", (t): void => {
    const packages: Array<Package> = [
        {
            name: "pack-01",
            path: "pack-01",
            version: "1.1.0",
            license: "MIT",
            repository: "company/project",
            licenseFile: "node_modules/pack-01/LICENSE",
        },
        { name: "pack-02", path: "pack-02", version: "2.0.0", license: "ISC", repository: "company/project" },
        {
            name: "pack-03",
            path: "pack-03",
            version: "2.0.0",
            license: "(MIT OR Apache-2.0)",
            repository: "company/project",
        },
    ];

    const text = new Text();
    text.detail(packages);

    t.true(
        stubConsole.calledWithExactly(`Packages
├─ ${chalk.blue("pack-01")}@${chalk.green("1.1.0")}
│  ├─ Licenses: MIT
│  ├─ License file: node_modules/pack-01/LICENSE
│  ├─ Path: pack-01
│  └─ Repository: company/project
├─ ${chalk.blue("pack-02")}@${chalk.green("2.0.0")}
│  ├─ Licenses: ISC
│  ├─ License file: UNKNOWN
│  ├─ Path: pack-02
│  └─ Repository: company/project
└─ ${chalk.blue("pack-03")}@${chalk.green("2.0.0")}
   ├─ Licenses: (MIT OR Apache-2.0)
   ├─ License file: UNKNOWN
   ├─ Path: pack-03
   └─ Repository: company/project
`),
    );
});

test.serial("Summary", (t): void => {
    const licenses: Array<{ name: string; count: number }> = [
        { name: "MIT", count: 15 },
        { name: Literals.UNKNOWN, count: 5 },
        { name: "ISC", count: 1 },
    ];

    const text = new Text();
    text.summary(licenses);

    t.true(
        stubConsole.calledWithExactly(`Licenses
├─ MIT: 15
├─ ${chalk.red("UNKNOWN")}: 5
└─ ISC: 1
`),
    );
});

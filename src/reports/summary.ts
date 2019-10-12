import { Reporter } from "./reporter";
import { Formatter } from "../formatters";
import { Package } from "../interfaces";

export class Summary implements Reporter {

    private readonly licenses = new Array<{name: string, count: number}>();

    constructor(
        private readonly formatter: Formatter
    ) { }

    public process(packages: Array<Package>): void {
        for (const pack of packages) {
            if (pack.license === undefined) {
                console.log(pack.name);
            }
            this.increase(pack.license);
        }
        this.licenses.sort((a, b) => {
            return b.count - a.count;
        });
        this.formatter.summary(this.licenses);
    }

    private increase(name: string): void {
        for (const license of this.licenses) {
            if (license.name === name) {
                license.count += 1;
                return;
            }
        }
        this.licenses.push({
            name,
            count: 1
        });
    }
}
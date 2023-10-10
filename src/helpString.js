


export default function helpString(options) {
    let string = "";
    string += "NAME\n";
    string += "\t" + (options.name ?? "[options.name]") + " - " + (options.short ?? "[options.short]") + "\n\n";
    string += "SYNOPSIS\n"
    string += "\t" + (options.synopsis ?? "[options.synopsis]") + "\n\n";
    string += "DESCRIPTION\n";
    string += "\t" + (options.desc ?? "[options.desc]") + "\n\n";

    for (let flag of options.flags) {
        string += "\t";
        if (flag.short) string += "-" + flag.short + ", ";
        string += "--" + flag.long + "\n";
        string += "\t\t" + (flag.desc?.replace(/\n/, "\n\t\t") ?? "[flag.desc]") + "\n\n";
    }

    return string;
}